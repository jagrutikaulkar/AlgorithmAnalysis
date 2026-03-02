// Sidebar Component
// Handles: file upload, dataset info summary, column selection, and algorithm selection
import { useState, useRef } from "react";
import { uploadCSV, downloadModel } from "../api";
import {
    FiUploadCloud, FiFileText, FiTarget,
    FiCpu, FiDownload, FiZap
} from "react-icons/fi";

const ALGORITHMS = [
    "Logistic Regression",
    "Decision Tree",
    "Random Forest",
    "K-Nearest Neighbors",
];

export default function Sidebar({ onUpload, onTrain, hasModel, columns }) {
    const [file, setFile] = useState(null);
    const [targetCol, setTargetCol] = useState("");
    const [algorithm, setAlgorithm] = useState(ALGORITHMS[0]);
    const [uploading, setUploading] = useState(false);
    const [training, setTraining] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [trainError, setTrainError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef();

    // Handle file drop or selection
    const handleFile = (f) => {
        if (!f || !f.name.endsWith(".csv")) {
            setUploadError("Please upload a valid .csv file.");
            return;
        }
        setUploadError("");
        setFile(f);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    // Upload to backend
    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setUploadError("");
        try {
            const result = await uploadCSV(file);
            onUpload(result);
            // Default target to last column
            if (result.columns?.length) {
                setTargetCol(result.columns[result.columns.length - 1]);
            }
        } catch (err) {
            setUploadError(err.response?.data?.detail || "Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    // Train model
    const handleTrain = async () => {
        if (!targetCol) { setTrainError("Select a target column."); return; }
        setTraining(true);
        setTrainError("");
        try {
            const result = await trainModel(targetCol, algorithm);
            onTrain(result);
        } catch (err) {
            setTrainError(err.response?.data?.detail || "Training failed.");
        } finally {
            setTraining(false);
        }
    };

    return (
        <aside className="w-72 min-h-screen bg-surface-800 border-r border-surface-600 flex flex-col gap-0 overflow-y-auto">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-surface-600">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">ML</div>
                    <span className="font-bold text-white text-sm tracking-wide">Analytics Platform</span>
                </div>
            </div>

            <div className="flex flex-col gap-5 p-5 flex-1">
                {/* ── Step 1: Upload ── */}
                <div>
                    <p className="section-label">Step 1 — Dataset</p>
                    <div
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all
              ${dragOver ? "border-brand-400 bg-brand-500/10" : "border-surface-500 hover:border-brand-500 bg-surface-700"}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <FiUploadCloud className="text-3xl text-brand-400" />
                        <p className="text-xs text-slate-400 text-center leading-relaxed">
                            {file ? (
                                <span className="text-brand-400 font-semibold">{file.name}</span>
                            ) : (
                                <>Drag & drop CSV<br />or <span className="text-brand-400 underline">browse files</span></>
                            )}
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files[0])}
                        />
                    </div>

                    {uploadError && <p className="text-red-400 text-xs mt-2">{uploadError}</p>}

                    <button
                        className="btn-primary mt-3"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Uploading…</span>
                        ) : (
                            <span className="flex items-center justify-center gap-2"><FiFileText /> Upload Dataset</span>
                        )}
                    </button>
                </div>

                {/* ── Step 2: Target Column ── */}
                {columns?.length > 0 && (
                    <div>
                        <p className="section-label">Step 2 — Target Column</p>
                        <div className="relative">
                            <FiTarget className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 text-sm" />
                            <select
                                className="w-full bg-surface-700 border border-surface-500 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-400 transition"
                                value={targetCol}
                                onChange={(e) => setTargetCol(e.target.value)}
                            >
                                {columns.map((col) => (
                                    <option key={col} value={col}>{col}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Algorithm ── */}
                {columns?.length > 0 && (
                    <div>
                        <p className="section-label">Step 3 — Algorithm</p>
                        <div className="relative">
                            <FiCpu className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 text-sm" />
                            <select
                                className="w-full bg-surface-700 border border-surface-500 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-400 transition"
                                value={algorithm}
                                onChange={(e) => setAlgorithm(e.target.value)}
                            >
                                {ALGORITHMS.map((alg) => (
                                    <option key={alg} value={alg}>{alg}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* ── Step 4: Train ── */}
                {columns?.length > 0 && (
                    <div>
                        <p className="section-label">Step 4 — Train</p>
                        {trainError && <p className="text-red-400 text-xs mb-2">{trainError}</p>}
                        <button className="btn-primary" onClick={handleTrain} disabled={training}>
                            {training ? (
                                <span className="flex items-center justify-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Training…</span>
                            ) : (
                                <span className="flex items-center justify-center gap-2"><FiZap /> Train Model</span>
                            )}
                        </button>
                    </div>
                )}

                {/* ── Download Model ── */}
                {hasModel && (
                    <div>
                        <p className="section-label">Download</p>
                        <button
                            className="w-full flex items-center justify-center gap-2 border border-brand-500 text-brand-400 hover:bg-brand-500/10 font-semibold py-2.5 px-4 rounded-xl transition text-sm"
                            onClick={downloadModel}
                        >
                            <FiDownload /> Download Model (.pkl)
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
