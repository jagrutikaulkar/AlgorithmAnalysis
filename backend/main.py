# =============================================================================
# ML Model Training & Analytics Platform — FastAPI Backend (v2)
#
# Key upgrades:
#   • Auto-detect CSV delimiter (comma, semicolon, tab, pipe)
#   • Handle European decimal format (comma as decimal separator)
#   • Strip trailing empty columns (e.g. "Date;Time;...;;")
#   • POST /train now accepts a LIST of algorithms → returns comparison
#   • Returns dataset-type analysis (classification vs regression hint)
# =============================================================================

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import pandas as pd
import numpy as np
import io, pickle, os, tempfile
from typing import List

from pydantic import BaseModel

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.svm import SVC, SVR
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, mean_squared_error, r2_score, mean_absolute_error
)

try:
    from xgboost import XGBClassifier, XGBRegressor
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

# =============================================================================
app = FastAPI(title="ML Analytics Platform API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory state
state = {
    "df": None,
    "model": None,
    "model_name": "",
    "model_path": None,
}

# =============================================================================
# CSV PARSING UTILITIES
# =============================================================================

def detect_delimiter(sample: str) -> str:
    """Detect the most likely delimiter from a CSV sample."""
    candidates = {";": 0, ",": 0, "\t": 0, "|": 0}
    for line in sample.splitlines()[:5]:
        for delim in candidates:
            candidates[delim] += line.count(delim)
    return max(candidates, key=candidates.get)


def fix_european_decimals(df: pd.DataFrame) -> pd.DataFrame:
    """
    Convert European decimal format (1.234,56) or (1,23) to float.
    Tries to convert each object column to numeric after replacing commas.
    """
    df = df.copy()
    for col in df.select_dtypes(include="object").columns:
        sample = df[col].dropna().head(20).astype(str)
        # Heuristic: if values match pattern of digits + comma + digits (European float)
        looks_european = sample.str.match(r"^-?\d+,\d+$").any()
        if looks_european:
            converted = pd.to_numeric(
                df[col].astype(str).str.replace(",", ".", regex=False),
                errors="coerce"
            )
            if converted.notna().mean() > 0.5:
                df[col] = converted
    return df


def load_csv_smart(contents: bytes) -> pd.DataFrame:
    """
    Load a CSV from bytes, auto-detecting delimiter and encoding.
    Handles:
    - Comma / semicolon / tab / pipe delimiters
    - European decimal separators (comma)
    - Trailing empty columns (;;)
    - Multiple encodings (utf-8, latin-1, cp1252)
    """
    for encoding in ["utf-8", "latin-1", "cp1252"]:
        try:
            text = contents.decode(encoding)
            break
        except Exception:
            continue
    else:
        raise ValueError("Unable to decode file with common encodings.")

    delim = detect_delimiter(text)

    df = pd.read_csv(
        io.StringIO(text),
        sep=delim,
        engine="python",
        on_bad_lines="skip",
    )

    # Drop completely empty columns (artifact of trailing delimiters like ";;")
    df = df.dropna(axis=1, how="all")

    # Drop columns whose name starts with "Unnamed"
    df = df.loc[:, ~df.columns.str.startswith("Unnamed")]

    # Strip whitespace from column names
    df.columns = df.columns.str.strip()

    # Fix European decimal format
    df = fix_european_decimals(df)

    # Convert obvious numeric strings
    for col in df.select_dtypes(include="object").columns:
        df[col] = pd.to_numeric(df[col], errors="ignore")

    return df


# =============================================================================
# ML UTILITIES
# =============================================================================

def encode_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df_enc = df.copy()
    for col in df_enc.select_dtypes(include=["object", "category"]).columns:
        le = LabelEncoder()
        df_enc[col] = le.fit_transform(df_enc[col].astype(str))
    return df_enc


ALGORITHMS = {
    "Logistic Regression":  LogisticRegression(max_iter=1000, random_state=42),
    "Decision Tree":        DecisionTreeClassifier(random_state=42),
    "Random Forest":        RandomForestClassifier(n_estimators=100, random_state=42),
    "K-Nearest Neighbors":  KNeighborsClassifier(n_neighbors=5),
    "SVM":                  SVC(kernel="rbf", random_state=42),
}

REGRESSION_ALGORITHMS = {
    "Linear Regression":    LinearRegression(),
    "Ridge Regression":     Ridge(alpha=1.0, random_state=42),
    "Lasso Regression":     Lasso(alpha=0.1, random_state=42),
    "Decision Tree":        DecisionTreeRegressor(random_state=42),
    "Random Forest":        RandomForestRegressor(n_estimators=100, random_state=42),
    "K-Nearest Neighbors":  KNeighborsRegressor(n_neighbors=5),
    "SVR":                  SVR(kernel="rbf"),
}

if HAS_XGBOOST:
    ALGORITHMS["XGBoost"] = XGBClassifier(n_estimators=100, random_state=42)
    REGRESSION_ALGORITHMS["XGBoost"] = XGBRegressor(n_estimators=100, random_state=42)


def get_model(name: str, task_type: str = "classification"):
    """Get a fresh model instance based on algorithm name and task type."""
    if task_type == "classification":
        if name not in ALGORITHMS:
            raise HTTPException(status_code=400, detail=f"Unknown classification algorithm: {name}")
        return ALGORITHMS[name]
    elif task_type == "regression":
        if name not in REGRESSION_ALGORITHMS:
            raise HTTPException(status_code=400, detail=f"Unknown regression algorithm: {name}")
        return REGRESSION_ALGORITHMS[name]
    else:
        raise HTTPException(status_code=400, detail=f"Unknown task type: {task_type}")


def analyze_target(series: pd.Series) -> dict:
    """Return insights about the target column for algorithm recommendations."""
    n_unique = series.nunique()
    dtype = str(series.dtype)
    is_numeric = pd.api.types.is_numeric_dtype(series)
    balance = series.value_counts(normalize=True).to_dict()
    minority_ratio = min(balance.values()) if balance else 0

    # Detect task type
    task_type = "classification"  # default
    recommended = list(ALGORITHMS.keys())
    
    if is_numeric and n_unique > 20:
        # Likely regression
        task_type = "regression"
        recommended = list(REGRESSION_ALGORITHMS.keys())
    elif not is_numeric or (is_numeric and n_unique <= 20):
        # Likely classification
        task_type = "classification"
        recommended = list(ALGORITHMS.keys())

    return {
        "n_unique_values": int(n_unique),
        "dtype": dtype,
        "task_type": task_type,
        "is_balanced": bool(minority_ratio > 0.3) if task_type == "classification" else None,
        "minority_class_ratio": round(float(minority_ratio), 4) if task_type == "classification" else None,
        "recommended_algorithms": recommended,
    }


# =============================================================================
# REQUEST MODELS
# =============================================================================

class TrainRequest(BaseModel):
    target_column: str
    algorithms: List[str]  # list of algorithm names to compare
    task_type: str = "classification"  # "classification" or "regression"


# =============================================================================
# ENDPOINT 1: Upload CSV
# =============================================================================
@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        df = load_csv_smart(contents)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"CSV parse error: {e}")

    if df.empty or df.shape[1] < 2:
        raise HTTPException(status_code=422, detail="Dataset too small or failed to parse correctly.")

    state["df"] = df
    state["model"] = None

    missing = {
        col: int(df[col].isnull().sum())
        for col in df.columns if df[col].isnull().sum() > 0
    }

    numeric_df = encode_dataframe(df).select_dtypes(include=np.number)
    corr = numeric_df.corr().round(3)

    # Target analysis for each column (for smart suggestions)
    target_analysis = {}
    for col in df.columns:
        target_analysis[col] = analyze_target(df[col].dropna())

    return {
        "shape": {"rows": int(df.shape[0]), "columns": int(df.shape[1])},
        "columns": df.columns.tolist(),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "missing_values": missing,
        "preview": df.head(5).fillna("").astype(str).to_dict(orient="records"),
        "correlation": {
            "columns": corr.columns.tolist(),
            "matrix": corr.values.tolist()
        },
        "target_analysis": target_analysis,
        "available_algorithms": {
            "classification": list(ALGORITHMS.keys()),
            "regression": list(REGRESSION_ALGORITHMS.keys()),
        },
    }


# =============================================================================
# ENDPOINT 2: Train Multiple Models and Compare
# =============================================================================
@app.post("/train")
async def train_models(req: TrainRequest):
    if state["df"] is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded. Call /upload first.")
    if not req.algorithms:
        raise HTTPException(status_code=400, detail="Select at least one algorithm.")

    df = state["df"].dropna()
    df_enc = encode_dataframe(df)

    if req.target_column not in df_enc.columns:
        raise HTTPException(status_code=400, detail=f"Column '{req.target_column}' not found.")

    X = df_enc.drop(columns=[req.target_column])
    y = df_enc[req.target_column]
    feature_names = X.columns.tolist()

    # Scale features for better model performance
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_scaled = pd.DataFrame(X_scaled, columns=X.columns)

    # Determine task type from target
    task_type = req.task_type
    if task_type == "classification":
        # Encode target if still object
        if y.dtype == "object":
            le = LabelEncoder()
            y = pd.Series(le.fit_transform(y.astype(str)), index=y.index)
            class_labels = [str(c) for c in le.classes_]
        else:
            class_labels = [str(c) for c in sorted(y.unique())]
    else:
        class_labels = None

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    results = []
    best_model = None
    best_score = -float('inf')
    best_name = ""

    for algo_name in req.algorithms:
        try:
            model = get_model(algo_name, task_type)
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)

            if task_type == "classification":
                # Classification metrics
                acc  = round(float(accuracy_score(y_test, y_pred)), 4)
                prec = round(float(precision_score(y_test, y_pred, average="weighted", zero_division=0)), 4)
                rec  = round(float(recall_score(y_test, y_pred, average="weighted", zero_division=0)), 4)
                f1   = round(float(f1_score(y_test, y_pred, average="weighted", zero_division=0)), 4)
                cm   = confusion_matrix(y_test, y_pred).tolist()

                metrics = {"accuracy": acc, "precision": prec, "recall": rec, "f1_score": f1}
                best_score_val = f1
                
                # Feature importance for tree-based and ensemble models
                fi = None
                if hasattr(model, 'feature_importances_'):
                    imps = model.feature_importances_.tolist()
                    fi = {"features": feature_names, "importances": [round(v, 4) for v in imps]}

                result = {
                    "algorithm": algo_name,
                    "metrics": metrics,
                    "confusion_matrix": {"labels": class_labels, "matrix": cm},
                    "feature_importance": fi,
                }
            else:
                # Regression metrics
                r2 = round(float(r2_score(y_test, y_pred)), 4)
                rmse = round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 4)
                mae = round(float(mean_absolute_error(y_test, y_pred)), 4)

                metrics = {"r2_score": r2, "rmse": rmse, "mae": mae}
                best_score_val = r2

                # Feature importance for tree-based and ensemble models
                fi = None
                if hasattr(model, 'feature_importances_'):
                    imps = model.feature_importances_.tolist()
                    fi = {"features": feature_names, "importances": [round(v, 4) for v in imps]}

                result = {
                    "algorithm": algo_name,
                    "metrics": metrics,
                    "feature_importance": fi,
                }

            results.append(result)

            if best_score_val > best_score:
                best_score = best_score_val
                best_model = model
                best_name = algo_name

        except Exception as e:
            results.append({"algorithm": algo_name, "error": str(e)})

    # Save best model
    model_path = None
    if best_model:
        model_path = os.path.join(tempfile.gettempdir(), "ml_platform_model.pkl")
        with open(model_path, "wb") as f:
            pickle.dump({"model": best_model, "scaler": scaler, "task_type": task_type}, f)
        state["model"] = best_model
        state["model_name"] = best_name
        state["model_path"] = model_path

    return {
        "results": results,
        "best_algorithm": best_name,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "target_column": req.target_column,
        "task_type": task_type,
    }


# =============================================================================
# ENDPOINT 3: Download Best Model
# =============================================================================
@app.get("/download-model")
async def download_model():
    if not state["model"] or not state["model_path"]:
        raise HTTPException(status_code=404, detail="No trained model. Run /train first.")
    safe = state["model_name"].lower().replace(" ", "_").replace("-", "_")
    return FileResponse(state["model_path"], filename=f"{safe}_model.pkl", media_type="application/octet-stream")


# =============================================================================
# HEALTH CHECK
# =============================================================================
@app.get("/")
def root():
    return {"status": "ok", "message": "ML Analytics Platform API v2 running!"}
