# ML Analytics Platform - Complete Setup Guide

## 📋 Project Overview

This is a comprehensive machine learning platform that allows users to upload CSV datasets and automatically:
- Detect whether the problem is classification or regression
- Train multiple algorithms simultaneously
- Compare results side-by-side
- Visualize metrics and feature importance
- Download the best-performing model

## 🛠️ Prerequisites

Before you begin, ensure you have installed:

1. **Python 3.8+** - Download from https://www.python.org/
2. **Node.js 14+** - Download from https://nodejs.org/
3. **Git** (optional, for version control)

To verify installations, open Command Prompt/PowerShell and run:
```bash
python --version
node --version
npm --version
```

## 🚀 Quick Start

### Setup Instructions

**Step 1: Setup Backend**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

**Step 2: Setup Frontend**
```bash
cd app
npm install
cd ..
```

## ▶️ Running the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend Dev Server:**
```bash
cd app
npm run dev
```

Then open your browser and navigate to: **http://localhost:5173**

## 🎯 How to Use

### Step 1: Upload Dataset
- Click "Browse" or drag & drop a CSV file
- Supported delimiters: comma (,), semicolon (;), tab, pipe (|)
- Supports European decimal formats (1,5 instead of 1.5)

### Step 2: Select Target Column
- Choose the column you want to predict from the dropdown
- The platform automatically detects if it's classification or regression

### Step 3: Select Algorithms
- All recommended algorithms are pre-selected
- For **Classification**: Logistic Regression, Decision Tree, Random Forest, KNN, SVM, XGBoost
- For **Regression**: Linear Regression, Ridge, Lasso, Decision Tree, Random Forest, KNN, SVR, XGBoost
- Check/uncheck algorithms as needed

### Step 4: Train & Compare
- Click "Train & Compare" to start training
- Wait for all models to complete training
- Results appear automatically in the Comparison tab

### Step 5: Explore Results
- **Dataset Tab**: View data summary, missing values, column types
- **Correlation Tab**: See feature correlations as a heatmap
- **Matrices Tab**: View confusion matrices (classification) or feature importance
- **Comparison Tab**: Compare all algorithms side-by-side with metrics

### Step 6: Download Model
- After training completes, click "Download .pkl" to save the best model
- The model is saved as a pickle file with the best algorithm name

## 📊 Supported Data Formats

### CSV Delimiters
- Comma (,) — most common
- Semicolon (;) — European standard
- Tab — tab-separated values
- Pipe (|) — pipe-separated values

### Encoding
- UTF-8 (preferred)
- Latin-1 / ISO-8859-1
- CP1252 / Windows-1252

### Decimal Formats
- English: 1.5, 2.25
- European: 1,5 (automatically converted)

## 🤖 Classification Algorithms

1. **Logistic Regression** - Fast, interpretable linear model
2. **Decision Tree** - Interpretable tree-based model
3. **Random Forest** - Ensemble of decision trees
4. **K-Nearest Neighbors** - Instance-based learning
5. **SVM** - Support Vector Machine with RBF kernel
6. **XGBoost** - Powerful gradient boosting (if installed)

## 📈 Regression Algorithms

1. **Linear Regression** - Simple linear relationship
2. **Ridge Regression** - L2 regularization for stability
3. **Lasso Regression** - L1 regularization for feature selection
4. **Decision Tree Regressor** - Tree-based non-linear
5. **Random Forest Regressor** - Ensemble for robust predictions
6. **K-Nearest Neighbors Regressor** - Instance-based regression
7. **SVR** - Support Vector Regression
8. **XGBoost Regressor** - Powerful boosting (if installed)

## 📊 Classification Metrics

- **Accuracy** - Percentage of correct predictions
- **Precision** - Of predicted positives, how many are correct
- **Recall** - Of actual positives, how many we found
- **F1 Score** - Harmonic mean of precision and recall

## 📉 Regression Metrics

- **R² Score** - Coefficient of determination (0-1, higher is better)
- **RMSE** - Root Mean Squared Error (lower is better)
- **MAE** - Mean Absolute Error (lower is better)

## 📁 Project Structure

```
ml-platform/
├── backend/
│   ├── main.py              # FastAPI backend server
│   └── requirements.txt      # Python dependencies
├── app/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── api.js           # API client for backend
│   │   ├── index.css        # Global styles
│   │   └── components/      # React components
│   │       ├── Sidebar.jsx
│   │       ├── DatasetPanel.jsx
│   │       ├── ComparisonChart.jsx
│   │       ├── ConfusionMatrix.jsx
│   │       ├── CorrelationHeatmap.jsx
│   │       ├── FeatureImportance.jsx
│   │       └── MetricCards.jsx
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   └── tailwind.config.js   # Tailwind CSS config
├── setup.bat                # Automatic setup script
├── run.bat                  # Automatic start script
└── README.md                # This file
```

## 🔧 Troubleshooting

### Issue: "Python not found" or "pip not found"

**Solution**: Python is not in your system PATH. Either:
1. Reinstall Python and check "Add Python to PATH" during installation
2. Or use the full path: `C:\PythonXX\python.exe -m pip install ...`

### Issue: "Node not found" or "npm not found"

**Solution**: Node.js is not installed or not in PATH. Reinstall from https://nodejs.org/

### Issue: Port 8000 already in use (Backend)

**Solution**: Change the port number:
```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8001
```
Then update `BASE_URL` in `app/src/api.js` to `http://localhost:8001`

### Issue: Port 5173 already in use (Frontend)

**Solution**: React/Vite will automatically find another port (5174, 5175, etc.). Check the terminal output.

### Issue: "ModuleNotFoundError: No module named 'xgboost'"

**Solution**: This is optional. XGBoost will be skipped if not installed. To install:
```bash
pip install xgboost
```

### Issue: CORS Error / Connection Refused to http://localhost:8000

**Solution**: Make sure:
1. Backend is running on port 8000
2. Backend is started BEFORE frontend
3. Check that the backend didn't crash (look at the terminal where you started it)

### Issue: Metrics not showing or wrong format

**Solution**: Make sure you're sending correct `task_type`. Classification problems should have:
- `accuracy`, `precision`, `recall`, `f1_score`

Regression problems should have:
- `r2_score`, `rmse`, `mae`

## 📦 Dependencies

### Backend (Python)
- FastAPI - Web framework
- Uvicorn - ASGI server
- Pandas - Data manipulation  
- NumPy - Numerical computing
- Scikit-learn - Machine learning algorithms
- XGBoost - Gradient boosting (optional)

### Frontend (Node.js)
- React - UI framework
- Vite - Build tool
- Tailwind CSS - styling
- Recharts - charting library
- Lucide React - icons
- Axios - HTTP client

## 🎓 Features

✅ Multi-format CSV support (auto-detect delimiter and encoding)
✅ Automatic task type detection (classification vs regression)
✅ Multiple algorithms comparison
✅ Side-by-side metrics visualization
✅ Feature importance analysis
✅ Confusion matrices for classification
✅ Correlation heatmap
✅ Download trained models
✅ Beautiful, responsive UI
✅ Real-time training progress
✅ Automatic preprocessing and scaling

## 🔒 Security Notes

- This is a development application. For production:
  - Add user authentication
  - Validate all file uploads
  - Implement rate limiting
  - Use HTTPS
  - Add CSRF protection
  - Sanitize user inputs

## 📝 Example Datasets

You can test the platform with:

1. **Iris Dataset** - Classification (3 classes)
2. **Titanic Dataset** - Classification (survived/not survived)
3. **Boston Housing** - Regression (house prices)
4. **Wine Quality** - Regression (quality score)
5. **Breast Cancer** - Classification (benign/malignant)

## 🚀 Deployment

For production deployment:

1. **Build Frontend**:
   ```bash
   cd app
   npm run build
   ```

2. **Deploy Backend**:
   - Use Gunicorn, Uvicorn, or cloud platforms (Heroku, AWS, GCP)
   - Set `DEBUG = False`
   - Use environment variables for configuration

3. **Serve Frontend**:
   - Use Nginx or cloud CDN
   - Update backend URL in environment variables

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the terminal error messages
3. Ensure all prerequisites are installed correctly
4. Try clearing browser cache and restarting services

## 📄 License

This is an educational project created for data science learning.

---

**Happy Machine Learning! 🎉**

Need help? Make sure both servers are running and check the browser console (F12) for error messages.
