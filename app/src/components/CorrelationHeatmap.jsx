// CorrelationHeatmap — color-scaled table for feature correlations
export default function CorrelationHeatmap({ data }) {
    if (!data) return null;
    const { columns, matrix } = data;

    const getColor = (val) => {
        if (val === null || isNaN(val)) return "rgba(255,255,255,0.02)";
        const t = (val + 1) / 2; // 0→1
        const r = Math.round(56 + t * (139 - 56));
        const g = Math.round(189 - t * 189);
        const b = Math.round(227 + t * (245 - 227));
        return `rgba(${r},${g},${b},${0.1 + Math.abs(val) * 0.65})`;
    };

    const cell = Math.min(50, Math.floor(520 / (columns.length + 1)));

    return (
        <div>
            <p className="section-label">Correlation Heatmap</p>
            <div className="glass-card p-5 overflow-auto">
                <table className="border-collapse text-center" style={{ fontSize: "9px" }}>
                    <thead>
                        <tr>
                            <th style={{ minWidth: 80 }} />
                            {columns.map((c) => (
                                <th key={c} style={{ minWidth: cell, maxWidth: cell }} className="text-slate-400 font-semibold pb-1">
                                    <span className="block truncate" style={{ maxWidth: cell }} title={c}>{c}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={i}>
                                <td className="text-slate-400 font-semibold text-right pr-2 text-[9px]">
                                    <span className="block truncate" style={{ maxWidth: 80 }} title={columns[i]}>{columns[i]}</span>
                                </td>
                                {row.map((val, j) => (
                                    <td
                                        key={j}
                                        title={`${columns[i]} × ${columns[j]}: ${val}`}
                                        style={{
                                            backgroundColor: getColor(val),
                                            width: cell, height: cell,
                                            border: "1px solid rgba(255,255,255,0.04)",
                                        }}
                                        className="font-semibold text-white"
                                    >
                                        {val !== null && !isNaN(val) ? val.toFixed(2) : ""}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Legend */}
                <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                    <span>−1</span>
                    <div className="flex-1 h-2 rounded-full" style={{
                        background: "linear-gradient(to right,rgba(56,189,227,0.8),rgba(17,24,37,0.8),rgba(139,127,247,0.8))"
                    }} />
                    <span>+1</span>
                    <span className="ml-2 text-slate-500 text-[10px]">Negative → Positive</span>
                </div>
            </div>
        </div>
    );
}
