// api.js — Axios calls to FastAPI backend (v2: multi-algo training)
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const api = axios.create({ baseURL: BASE_URL });

/** Upload CSV — returns dataset summary + target_analysis + available_algorithms */
export const uploadCSV = async (file) => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

/**
 * Train multiple models and compare.
 * @param {string} targetColumn
 * @param {string[]} algorithms — array of algorithm names
 * @param {string} taskType — "classification" or "regression"
 */
export const trainModels = async (targetColumn, algorithms, taskType = "classification") => {
    const { data } = await api.post("/train", {
        target_column: targetColumn,
        algorithms,
        task_type: taskType,
    });
    return data;
};

/** Download best trained model .pkl */
export const downloadModel = () => {
    window.open(`${BASE_URL}/download-model`, "_blank");
};
