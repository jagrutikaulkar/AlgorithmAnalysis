// App.jsx — Root with 4 tabs: Dataset, Correlation, Confusion Matrices, Comparison
import { useState } from "react";
import {
  Database, Thermometer, BarChart2, GitCompare,
  Layers, CheckCircle2
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import DatasetPanel from "./components/DatasetPanel";
import CorrelationHeatmap from "./components/CorrelationHeatmap";
import MetricCards from "./components/MetricCards";
import ConfusionMatrix from "./components/ConfusionMatrix";
import FeatureImportance from "./components/FeatureImportance";
import ComparisonChart from "./components/ComparisonChart";

const TABS = [
  { label: "Dataset", icon: Database, id: "dataset" },
  { label: "Correlation", icon: Thermometer, id: "corr" },
  { label: "Matrices", icon: BarChart2, id: "matrices" },
  { label: "Comparison", icon: GitCompare, id: "compare" },
];

export default function App() {
  const [dataset, setDataset] = useState(null);
  const [trainData, setTrainData] = useState(null);  // { results, best_algorithm, ... }
  const [activeTab, setActiveTab] = useState("dataset");

  const handleUpload = (data) => {
    setDataset(data);
    setTrainData(null);
    setActiveTab("dataset");
  };

  const handleTrain = (data) => {
    setTrainData(data);
    setActiveTab("compare");
  };

  const columns = dataset?.columns ?? [];
  const hasResults = !!trainData;
  const validResults = trainData?.results?.filter((r) => !r.error) ?? [];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onUpload={handleUpload}
        onTrain={handleTrain}
        hasModel={hasResults}
        columns={columns}
        targetAnalysis={dataset?.target_analysis}
      />

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="px-8 py-4 border-b border-surface-600 bg-surface-800/70 backdrop-blur-sm flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold gradient-text flex items-center gap-2">
              <Layers size={18} className="text-brand-400" />
              ML Model Training &amp; Analytics Platform
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Final-Year Data Science Project · React + FastAPI + Scikit-learn</p>
          </div>
          <div className="flex items-center gap-3">
            {dataset && (
              <div className="text-xs text-slate-400 bg-surface-700 border border-surface-500 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-400" />
                {dataset.shape.rows} rows · {dataset.shape.columns} cols
              </div>
            )}
            {hasResults && (
              <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2">
                🏆 Best: {trainData.best_algorithm}
              </div>
            )}
          </div>
        </header>

        {/* Landing */}
        {!dataset && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center shadow-2xl shadow-brand-500/30">
              <Layers size={36} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to ML Analytics Platform</h2>
              <p className="text-slate-400 text-sm max-w-md">
                Upload any CSV (comma, semicolon, tab, European decimal format), explore your data,
                select algorithms, and compare them side-by-side — all in one click.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2 text-left max-w-lg">
              {[
                [<BarChart2 size={18} />, "Multi-format CSV", "Auto-detects delimiter & encoding"],
                [<Database size={18} />, "Smart Analysis", "Dataset insights + algo suggestions"],
                [<Layers size={18} />, "4 Algorithms", "Compare all simultaneously"],
                [<GitCompare size={18} />, "Side-by-Side", "Bar charts + leaderboard table"],
                [<Thermometer size={18} />, "Correlation", "Heatmap + confusion matrices"],
                [<CheckCircle2 size={18} />, "Export Model", "Download best model as .pkl"],
              ].map(([icon, title, desc], i) => (
                <div key={i} className="glass-card p-4 flex flex-col gap-1.5">
                  <span className="text-brand-400">{icon}</span>
                  <span className="text-sm font-semibold text-white">{title}</span>
                  <span className="text-xs text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        {dataset && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tab Bar */}
            <div className="flex gap-0.5 px-6 pt-3 border-b border-surface-600 bg-surface-800/40">
              {TABS.map(({ label, icon: Icon, id }) => {
                const requiresResults = id === "matrices" || id === "compare";
                const disabled = requiresResults && !hasResults;
                return (
                  <button
                    key={id}
                    disabled={disabled}
                    onClick={() => !disabled && setActiveTab(id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all cursor-pointer
                      ${activeTab === id
                        ? "border-brand-400 text-brand-400 bg-brand-500/10"
                        : "border-transparent text-slate-400 hover:text-white hover:bg-surface-700"}
                      ${disabled ? "opacity-30 cursor-not-allowed pointer-events-none" : ""}`}
                  >
                    <Icon size={13} />
                    {label}
                    {id === "compare" && hasResults && (
                      <span className="ml-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {validResults.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">

              {activeTab === "dataset" && (
                <DatasetPanel data={dataset} />
              )}

              {activeTab === "corr" && (
                <CorrelationHeatmap data={dataset?.correlation} />
              )}

              {activeTab === "matrices" && hasResults && (
                <div className="flex flex-col gap-8">
                  {/* Per-algorithm: metrics + confusion + feature importance */}
                  {validResults.map((r) => (
                    <div key={r.algorithm} className="glass-card p-6">
                      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <Layers size={16} className="text-brand-400" /> {r.algorithm}
                        {r.algorithm === trainData.best_algorithm && (
                          <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">🏆 BEST</span>
                        )}
                      </h3>

                      {/* Mini metric row - Classification */}
                      {trainData.task_type === "classification" && (
                        <div className="grid grid-cols-4 gap-3 mb-5">
                          {[
                            { label: "Accuracy", value: r.metrics.accuracy, color: "text-violet-400" },
                            { label: "Precision", value: r.metrics.precision, color: "text-sky-400" },
                            { label: "Recall", value: r.metrics.recall, color: "text-emerald-400" },
                            { label: "F1 Score", value: r.metrics.f1_score, color: "text-amber-400" },
                          ].map(({ label, value, color }) => (
                            <div key={label} className="bg-surface-700 border border-surface-600 rounded-xl p-3 text-center">
                              <div className={`text-xl font-extrabold ${color}`}>{(value * 100).toFixed(1)}%</div>
                              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Mini metric row - Regression */}
                      {trainData.task_type === "regression" && (
                        <div className="grid grid-cols-3 gap-3 mb-5">
                          {[
                            { label: "R² Score", value: r.metrics.r2_score, color: "text-violet-400", format: "decimal" },
                            { label: "RMSE", value: r.metrics.rmse, color: "text-sky-400", format: "decimal" },
                            { label: "MAE", value: r.metrics.mae, color: "text-emerald-400", format: "decimal" },
                          ].map(({ label, value, color, format }) => (
                            <div key={label} className="bg-surface-700 border border-surface-600 rounded-xl p-3 text-center">
                              <div className={`text-xl font-extrabold ${color}`}>
                                {format === "decimal" ? value.toFixed(4) : (value * 100).toFixed(1) + "%"}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Confusion + Feature Importance (Classification only) */}
                      {trainData.task_type === "classification" && (
                        <div className={`grid gap-5 ${r.feature_importance ? "lg:grid-cols-2" : "grid-cols-1 max-w-lg"}`}>
                          <ConfusionMatrix data={r.confusion_matrix} />
                          {r.feature_importance && (
                            <FeatureImportance data={r.feature_importance} />
                          )}
                        </div>
                      )}

                      {/* Feature Importance (Regression) */}
                      {trainData.task_type === "regression" && r.feature_importance && (
                        <FeatureImportance data={r.feature_importance} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "compare" && hasResults && (
                <ComparisonChart
                  results={trainData.results}
                  bestAlgorithm={trainData.best_algorithm}
                  taskType={trainData.task_type}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
