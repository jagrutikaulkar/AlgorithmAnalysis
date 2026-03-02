// DatasetPanel — shape stats, data preview table, column info, missing values
export default function DatasetPanel({ data }) {
    if (!data) return null;
    const { shape, columns, dtypes, missing_values, preview } = data;
    const missingEntries = Object.entries(missing_values || {});

    return (
        <div className="flex flex-col gap-6">

            {/* Shape Stats */}
            <div>
                <p className="section-label">Dataset Overview</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "Rows", value: shape.rows.toLocaleString(), color: "from-violet-500/20 border-violet-500/40 text-violet-400" },
                        { label: "Columns", value: shape.columns, color: "from-sky-500/20 border-sky-500/40 text-sky-400" },
                        { label: "Features", value: shape.columns - 1, color: "from-amber-500/20 border-amber-500/40 text-amber-400" },
                        { label: "Missing Cols", value: missingEntries.length, color: missingEntries.length > 0 ? "from-rose-500/20 border-rose-500/40 text-rose-400" : "from-emerald-500/20 border-emerald-500/40 text-emerald-400" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className={`bg-gradient-to-b ${color} border rounded-xl px-4 py-3 text-center`}>
                            <div className="text-2xl font-extrabold">{value}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview Table */}
            <div>
                <p className="section-label">Preview (first 5 rows)</p>
                <div className="overflow-x-auto rounded-xl border border-surface-600">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-surface-700 text-slate-300 uppercase tracking-wider">
                            <tr>{columns?.map((c) => <th key={c} className="px-3 py-2 border-b border-surface-600 whitespace-nowrap">{c}</th>)}</tr>
                        </thead>
                        <tbody>
                            {preview?.map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-surface-800" : "bg-surface-700/40"}>
                                    {columns?.map((c) => (
                                        <td key={c} className="px-3 py-1.5 text-slate-300 whitespace-nowrap">{String(row[c] ?? "—")}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Column Info */}
            <div>
                <p className="section-label">Column Types</p>
                <div className="grid grid-cols-2 gap-2">
                    {columns?.map((col) => (
                        <div key={col} className="bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 flex justify-between text-xs">
                            <span className="text-white font-medium truncate">{col}</span>
                            <span className="text-slate-400 ml-2 shrink-0">{dtypes?.[col]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Missing Values */}
            <div>
                <p className="section-label">Missing Values</p>
                {missingEntries.length === 0 ? (
                    <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
                        ✅ No missing values found.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-surface-600">
                        <table className="w-full text-xs">
                            <thead className="bg-surface-700 text-slate-300 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-2 text-left border-b border-surface-600">Column</th>
                                    <th className="px-4 py-2 text-right border-b border-surface-600">Count</th>
                                    <th className="px-4 py-2 text-right border-b border-surface-600">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {missingEntries.map(([col, cnt], i) => (
                                    <tr key={col} className={i % 2 === 0 ? "bg-surface-800" : "bg-surface-700/40"}>
                                        <td className="px-4 py-1.5 text-slate-300">{col}</td>
                                        <td className="px-4 py-1.5 text-rose-400 text-right">{cnt}</td>
                                        <td className="px-4 py-1.5 text-slate-400 text-right">{((cnt / shape.rows) * 100).toFixed(1)}%</td>
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
