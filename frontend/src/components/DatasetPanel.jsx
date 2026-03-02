// DatasetPanel Component
// Shows: shape metrics, preview table, missing values table
import { FiGrid, FiAlertCircle, FiList } from "react-icons/fi";

function StatBadge({ label, value, color = "brand" }) {
    const colors = {
        brand: "from-brand-500/20 to-purple-500/20 border-brand-500/40 text-brand-400",
        rose: "from-rose-500/20 to-pink-500/20 border-rose-500/40 text-rose-400",
        sky: "from-sky-500/20 to-cyan-500/20 border-sky-500/40 text-sky-400",
        amber: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400",
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl px-4 py-3 flex flex-col items-center`}>
            <span className="text-2xl font-extrabold">{value}</span>
            <span className="text-xs text-slate-400 mt-0.5">{label}</span>
        </div>
    );
}

export default function DatasetPanel({ data }) {
    if (!data) return null;
    const { shape, columns, dtypes, missing_values, preview } = data;
    const missingEntries = Object.entries(missing_values || {});

    return (
        <div className="flex flex-col gap-6">
            {/* Shape metrics */}
            <div>
                <p className="section-label">Dataset Overview</p>
                <div className="grid grid-cols-4 gap-3">
                    <StatBadge label="Rows" value={shape.rows.toLocaleString()} color="brand" />
                    <StatBadge label="Columns" value={shape.columns} color="sky" />
                    <StatBadge label="Missing Cols" value={missingEntries.length} color={missingEntries.length > 0 ? "rose" : "amber"} />
                    <StatBadge label="Features" value={shape.columns - 1} color="amber" />
                </div>
            </div>

            {/* Dataset Preview */}
            <div>
                <p className="section-label flex items-center gap-2"><FiGrid className="inline" /> Data Preview (first 5 rows)</p>
                <div className="overflow-x-auto rounded-xl border border-surface-600">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-surface-700 text-slate-300 uppercase tracking-wider">
                            <tr>
                                {columns?.map((col) => (
                                    <th key={col} className="px-3 py-2 whitespace-nowrap border-b border-surface-600">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {preview?.map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-surface-800" : "bg-surface-700/50"}>
                                    {columns?.map((col) => (
                                        <td key={col} className="px-3 py-1.5 text-slate-300 whitespace-nowrap">{String(row[col] ?? "")}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Column Types */}
            <div>
                <p className="section-label flex items-center gap-2"><FiList className="inline" /> Column Info</p>
                <div className="grid grid-cols-2 gap-2">
                    {columns?.map((col) => (
                        <div key={col} className="bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 flex justify-between items-center text-xs">
                            <span className="text-white font-medium truncate">{col}</span>
                            <span className="text-slate-400 ml-2 shrink-0">{dtypes?.[col]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Missing Values */}
            <div>
                <p className="section-label flex items-center gap-2"><FiAlertCircle className="inline text-rose-400" /> Missing Values</p>
                {missingEntries.length === 0 ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
                        ✅ No missing values found in the dataset.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-surface-600">
                        <table className="w-full text-xs">
                            <thead className="bg-surface-700 text-slate-300 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-2 text-left border-b border-surface-600">Column</th>
                                    <th className="px-4 py-2 text-right border-b border-surface-600">Missing Count</th>
                                    <th className="px-4 py-2 text-right border-b border-surface-600">% Missing</th>
                                </tr>
                            </thead>
                            <tbody>
                                {missingEntries.map(([col, count], i) => (
                                    <tr key={col} className={i % 2 === 0 ? "bg-surface-800" : "bg-surface-700/50"}>
                                        <td className="px-4 py-1.5 text-slate-300">{col}</td>
                                        <td className="px-4 py-1.5 text-rose-400 text-right">{count}</td>
                                        <td className="px-4 py-1.5 text-slate-400 text-right">
                                            {((count / (data.shape?.rows || 1)) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
