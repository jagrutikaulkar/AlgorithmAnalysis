// Sidebar — Upgraded with lucide-react icons and algorithm checkboxes
import { useState, useRef, useMemo } from "react";
import {
    UploadCloud, FileText, Target, Cpu, Download,
    Zap, CheckSquare, Square, ChevronRight, Database,
    AlertCircle, Loader2, Trophy
} from "lucide-react";
import { uploadCSV, trainModels, downloadModel } from "../api";

const ALGO_ICONS = {
    "Logistic Regression": "📈",
    "Decision Tree": "🌿",
    "Random Forest": "🌲",
    "K-Nearest Neighbors": "🔮",
    "SVM": "⚡",
    "SVR": "📊",
    "Linear Regression": "📉",
    "Ridge Regression": "🏔️",
    "Lasso Regression": "🎯",
    "XGBoost": "🚀",
};

export default function Sidebar({ onUpload, onTrain, hasModel, columns, targetAnalysis }) {
    const [file, setFile] = useState(null);
    const [target, setTarget] = useState("");
    const [selectedAlgos, setSelectedAlgos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [training, setTraining] = useState(false);
    const [uploadErr, setUploadErr] = useState("");
    const [trainErr, setTrainErr] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const [availableAlgorithms, setAvailableAlgorithms] = useState({
        classification: [],
        regression: [],
    });
    const fileRef = useRef();

    const handleFile = (f) => {
        if (!f) return;
        const ext = f.name.split(".").pop().toLowerCase();
        if (ext !== "csv") { setUploadErr("Please upload a .csv file."); return; }
        setUploadErr(""); setFile(f);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true); setUploadErr("");
        try {
            const res = await uploadCSV(file);
            onUpload(res);
            setAvailableAlgorithms(res.available_algorithms || { classification: [], regression: [] });
            if (res.columns?.length) {
                setTarget(res.columns[res.columns.length - 1]);
                // Select all algorithms for the detected task type by default
                const detectedTaskType = res.target_analysis?.[res.columns[res.columns.length - 1]]?.task_type || "classification";
                const algosList = res.available_algorithms?.[detectedTaskType] || [];
                setSelectedAlgos(algosList);
            }
        } catch (e) {
            setUploadErr(e.response?.data?.detail || "Upload failed.");
        } finally { setUploading(false); }
    };

    const detectedTaskType = useMemo(() => {
        return targetAnalysis?.[target]?.task_type || "classification";
    }, [target, targetAnalysis]);

    const currentAlgos = useMemo(() => {
        return availableAlgorithms[detectedTaskType] || [];
    }, [availableAlgorithms, detectedTaskType]);

    const handleTrain = async () => {
        if (!target) { setTrainErr("Select a target column."); return; }
        if (!selectedAlgos.length) { setTrainErr("Select at least one algorithm."); return; }
        setTraining(true); setTrainErr("");
        try {
            const res = await trainModels(target, selectedAlgos, detectedTaskType);
            onTrain(res);
        } catch (e) {
            setTrainErr(e.response?.data?.detail || "Training failed.");
        } finally { setTraining(false); }
    };

    const toggleAlgo = (name) => {
        setSelectedAlgos((prev) =>
            prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
        );
    };

    // Get recommended algos for selected target
    const recommended = targetAnalysis?.[target]?.recommended_algorithms ?? [];

    return (
        <aside className="w-64 shrink-0 min-h-screen bg-surface-800 border-r border-surface-600 flex flex-col overflow-y-auto">
            {/* Brand */}
            <div className="px-5 py-4 border-b border-surface-600">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center shrink-0">
                        <Cpu size={16} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-sm text-white block">ML Analytics</span>
                        <span className="text-slate-400 text-xs">Platform v2</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5 p-4 flex-1">

                {/* ── STEP 1: Upload ── */}
                <div>
                    <p className="section-label flex items-center gap-1.5">
                        <UploadCloud size={11} /> Step 1 — Upload Dataset
                    </p>
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                        onClick={() => fileRef.current.click()}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all text-center
              ${dragOver ? "border-brand-400 bg-brand-500/10" : "border-surface-500 hover:border-brand-500 bg-surface-700"}`}
                    >
                        <UploadCloud size={28} className={dragOver ? "text-brand-400" : "text-slate-400"} />
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {file
                                ? <span className="text-brand-400 font-semibold break-all">{file.name}</span>
                                : <><span className="text-brand-400 underline">Browse</span> or drag & drop CSV</>}
                        </p>
                        <p className="text-[10px] text-slate-500">Supports , ; TAB | delimiters</p>
                        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                    </div>

                    {uploadErr && (
                        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                            <AlertCircle size={11} /> {uploadErr}
                        </p>
                    )}

                    <button className="btn-primary mt-2.5" onClick={handleUpload} disabled={!file || uploading}>
                        {uploading
                            ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Analysing…</span>
                            : <span className="flex items-center justify-center gap-2"><FileText size={14} /> Upload Dataset</span>}
                    </button>
                </div>

                {/* ── STEP 2: Target Column ── */}
                {columns?.length > 0 && (
                    <div>
                        <p className="section-label flex items-center gap-1.5"><Target size={11} /> Step 2 — Target Column</p>
                        <select className="select-input" value={target} onChange={(e) => setTarget(e.target.value)}>
                            {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {targetAnalysis?.[target] && (
                            <div className="mt-1.5 bg-surface-700 rounded-lg px-3 py-2 text-xs flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <Database size={11} className="text-brand-400 shrink-0" />
                                    <span className="text-slate-400">
                                        <span className="text-white">{targetAnalysis[target].n_unique_values}</span> unique values
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">Task Type:</span>
                                    <span className={`font-semibold ${detectedTaskType === "classification" ? "text-emerald-400" : "text-blue-400"}`}>
                                        {detectedTaskType === "classification" ? "Classification" : "Regression"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── STEP 3: Algorithm Selection (Checkboxes) ── */}
                {columns?.length > 0 && (
                    <div>
                        <p className="section-label flex items-center gap-1.5"><Cpu size={11} /> Step 3 — Select Algorithms</p>
                        <div className="flex flex-col gap-1.5">
                            {currentAlgos.map((name) => {
                                const checked = selectedAlgos.includes(name);
                                const isRecommended = recommended.includes(name);
                                return (
                                    <button
                                        key={name}
                                        onClick={() => toggleAlgo(name)}
                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all cursor-pointer
                      ${checked
                                                ? "border-brand-500/60 bg-brand-500/10 text-white"
                                                : "border-surface-500 bg-surface-700 text-slate-400 hover:border-surface-400"}`}
                                    >
                                        {checked
                                            ? <CheckSquare size={15} className="text-brand-400 shrink-0" />
                                            : <Square size={15} className="text-slate-500 shrink-0" />}
                                        <span className="text-sm">{ALGO_ICONS[name] || "⚙️"}</span>
                                        <span className="text-xs font-medium flex-1 leading-tight">{name}</span>
                                        {isRecommended && (
                                            <span className="text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 py-0.5 rounded font-bold shrink-0">✓ REC</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setSelectedAlgos(currentAlgos)}
                            className="text-xs text-brand-400 hover:text-brand-300 mt-1.5 underline cursor-pointer"
                        >
                            Select all
                        </button>
                    </div>
                )}

                {/* ── STEP 4: Train ── */}
                {columns?.length > 0 && (
                    <div>
                        <p className="section-label flex items-center gap-1.5"><Zap size={11} /> Step 4 — Compare Models</p>
                        {trainErr && (
                            <p className="text-red-400 text-xs mb-2 flex items-center gap-1">
                                <AlertCircle size={11} /> {trainErr}
                            </p>
                        )}
                        <button className="btn-primary" onClick={handleTrain} disabled={training || !selectedAlgos.length}>
                            {training
                                ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Training {selectedAlgos.length} models…</span>
                                : <span className="flex items-center justify-center gap-2"><Zap size={14} /> Train &amp; Compare ({selectedAlgos.length})</span>}
                        </button>
                    </div>
                )}

                {/* ── Download ── */}
                {hasModel && (
                    <div>
                        <p className="section-label flex items-center gap-1.5"><Trophy size={11} /> Download Best Model</p>
                        <button
                            onClick={downloadModel}
                            className="w-full flex items-center justify-center gap-2 border border-brand-500/60 text-brand-400 hover:bg-brand-500/10 font-semibold py-2 px-4 rounded-xl transition text-sm cursor-pointer"
                        >
                            <Download size={14} /> Download .pkl
                        </button>
                    </div>
                )}
            </div>

            <div className="px-4 pb-4 text-center text-xs text-slate-500">
                React + FastAPI + Scikit-learn
            </div>
        </aside>
    );
}
