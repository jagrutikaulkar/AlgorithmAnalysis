// =============================================================================
// API Service — all Axios calls to the FastAPI backend
// =============================================================================
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const api = axios.create({ baseURL: BASE_URL });

/**
 * Upload a CSV file to the backend.
 * Returns dataset summary (shape, columns, missing, stats, correlation, preview).
 */
export const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

/**
 * Train the selected model.
 * @param {string} targetColumn - Name of the target column
 * @param {string} algorithm    - One of the 4 algorithm keys
 */
export const trainModel = async (targetColumn, algorithm) => {
    const { data } = await api.post("/train", {
        target_column: targetColumn,
        algorithm: algorithm,
    });
    return data;
};

/**
 * Trigger download of the trained model .pkl file.
 */
export const downloadModel = () => {
    window.open(`${BASE_URL}/download-model`, "_blank");
};
