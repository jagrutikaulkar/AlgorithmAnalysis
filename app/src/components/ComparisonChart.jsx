// ComparisonChart — Grouped bar chart comparing all trained algorithms
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Cell, LabelList
} from "recharts";
import { Trophy, TrendingUp } from "lucide-react";

const CLASSIFICATION_METRICS = [
    { key: "accuracy", label: "Accuracy", color: "#8b7ff7" },
    { key: "precision", label: "Precision", color: "#38bdf8" },
    { key: "recall", label: "Recall", color: "#34d399" },
    { key: "f1_score", label: "F1 Score", color: "#fbbf24" },
];

const REGRESSION_METRICS = [
    { key: "r2_score", label: "R² Score", color: "#8b7ff7" },
    { key: "mae", label: "MAE", color: "#38bdf8" },
];

// Short algorithm names for the chart axis
const SHORT_NAMES = {
    "Logistic Regression": "Log. Reg.",
    "Decision Tree": "Dec. Tree",
    "Random Forest": "Rnd. Forest",
    "K-Nearest Neighbors": "KNN",
    "SVM": "SVM",
    "SVR": "SVR",
    "Linear Regression": "Lin. Reg.",
    "Ridge Regression": "Ridge",
    "Lasso Regression": "Lasso",
    "XGBoost": "XGBoost",
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-surface-700 border border-surface-500 rounded-xl px-4 py-3 text-xs shadow-2xl min-w-[160px]">
            <p className="font-bold text-white mb-2">{label}</p>
            {payload.map((p) => {
                const isPercentage = p.dataKey.includes("accuracy") || p.dataKey.includes("precision") || 
                                    p.dataKey.includes("recall") || p.dataKey.includes("f1_score") || 
                                    p.dataKey.includes("r2_score");
                const value = isPercentage ? `${(p.value * 100).toFixed(1)}%` : p.value.toFixed(4);
                return (
                    <div key={p.dataKey} className="flex justify-between gap-4 mb-0.5">
                        <span style={{ color: p.color }}>{p.name}</span>
                        <span className="text-white font-semibold">{value}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default function ComparisonChart({ results, bestAlgorithm, taskType = "classification" }) {
    if (!results?.length) return null;

    // Filter out errored results
    const validResults = results.filter((r) => !r.error);
    if (!validResults.length) return null;

    const METRICS = taskType === "classification" ? CLASSIFICATION_METRICS : REGRESSION_METRICS;
    const bestMetricKey = taskType === "classification" ? "f1_score" : "r2_score";

    // Build chart data: one entry per algorithm
    const chartData = validResults.map((r) => ({
        name: SHORT_NAMES[r.algorithm] || r.algorithm,
        fullName: r.algorithm,
        ...r.metrics,
        isBest: r.algorithm === bestAlgorithm,
    }));

    // Leaderboard table data sorted by best metric
    const sorted = [...validResults].sort((a, b) => b.metrics[bestMetricKey] - a.metrics[bestMetricKey]);

    return (
        <div className="flex flex-col gap-6">

            {/* Best Algorithm Banner */}
            {bestAlgorithm && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 rounded-2xl px-5 py-4">
                    <Trophy size={28} className="text-amber-400 shrink-0" />
                    <div>
                        <p className="text-xs text-amber-300/70 uppercase tracking-widest font-bold">Best Algorithm</p>
                        <p className="text-xl font-extrabold text-white">{bestAlgorithm}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Best {METRICS[0].label}: <strong className="text-amber-400">
                                {taskType === "classification"
                                    ? `${(validResults.find(r => r.algorithm === bestAlgorithm)?.metrics?.f1_score * 100).toFixed(1)}%`
                                    : `${(validResults.find(r => r.algorithm === bestAlgorithm)?.metrics?.r2_score).toFixed(4)}`}
                            </strong>
                        </p>
                    </div>
                </div>
            )}

            {/* Grouped Bar Chart */}
            <div>
                <p className="section-label flex items-center gap-1.5"><TrendingUp size={11} /> Metrics Comparison</p>
                <div className="glass-card p-5">
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barGap={2} barCategoryGap="25%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1a2235" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#94a3b8", fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tickFormatter={(v) => taskType === "classification" ? `${(v * 100).toFixed(0)}%` : v.toFixed(2)}
                                tick={{ fill: "#94a3b8", fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                domain={taskType === "classification" ? [0, 1] : undefined}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                            <Legend
                                wrapperStyle={{ fontSize: "11px", color: "#94a3b8", paddingTop: "12px" }}
                            />
                            {METRICS.map(({ key, label, color }) => (
                                <Bar key={key} dataKey={key} name={label} fill={color} radius={[4, 4, 0, 0]}>
                                    <LabelList
                                        dataKey={key}
                                        position="top"
                                        formatter={(v) => taskType === "classification" ? `${(v * 100).toFixed(0)}%` : `${v.toFixed(2)}`}
                                        style={{ fill: "#64748b", fontSize: 9 }}
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div>
                <p className="section-label">🏆 Algorithm Leaderboard</p>
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-surface-700 text-slate-300 uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left border-b border-surface-600">Rank</th>
                                <th className="px-4 py-3 text-left border-b border-surface-600">Algorithm</th>
                                {METRICS.map(({ label, key }) => (
                                    <th key={key} className="px-4 py-3 text-right border-b border-surface-600">{label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((r, i) => {
                                const isBest = r.algorithm === bestAlgorithm;
                                return (
                                    <tr key={r.algorithm} className={`${isBest ? "bg-amber-500/5 border-l-2 border-amber-400" : i % 2 === 0 ? "bg-surface-800" : "bg-surface-700/30"}`}>
                                        <td className="px-4 py-2.5 font-bold">
                                            <span className={isBest ? "text-amber-400" : "text-slate-500"}>
                                                {isBest ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 font-semibold text-white flex items-center gap-1.5">
                                            {r.algorithm}
                                            {isBest && <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">BEST</span>}
                                        </td>
                                        {METRICS.map(({ key }) => (
                                            <td key={key} className={`px-4 py-2.5 text-right font-semibold ${isBest ? "text-amber-300" : "text-slate-300"}`}>
                                                {taskType === "classification"
                                                    ? `${(r.metrics[key] * 100).toFixed(2)}%`
                                                    : `${r.metrics[key].toFixed(4)}`}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
