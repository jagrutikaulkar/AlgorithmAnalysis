// CorrelationHeatmap Component
// Renders a color-coded table heatmap of the correlation matrix
export default function CorrelationHeatmap({ data }) {
    if (!data) return null;
    const { columns, matrix } = data;

    const getColor = (val) => {
        // val is -1 to 1, map to color:
        // negative → sky blue, zero → dark, positive → purple
        if (val === null || isNaN(val)) return "rgba(255,255,255,0.03)";
        const t = (val + 1) / 2; // 0 to 1
        const r = Math.round(56 + t * (139 - 56));
        const g = Math.round(189 - t * 189);
        const b = Math.round(227 - t * (227 - 245));
        const alpha = 0.1 + Math.abs(val) * 0.7;
        return `rgba(${r},${g},${b},${alpha})`;
    };

    const cellSize = Math.min(48, Math.floor(560 / (columns.length + 1)));

    return (
        <div>
            <p className="section-label">Correlation Heatmap</p>
            <div className="glass-card p-5 overflow-x-auto">
                <div className="inline-block min-w-full">
                    <table className="border-collapse text-center" style={{ fontSize: "10px" }}>
                        <thead>
                            <tr>
                                <th style={{ minWidth: `${cellSize + 20}px` }} />
                                {columns.map((col) => (
                                    <th
                                        key={col}
                                        style={{ minWidth: `${cellSize}px`, maxWidth: `${cellSize}px` }}
                                        className="text-slate-400 font-semibold pb-1 whitespace-nowrap overflow-hidden text-ellipsis"
                                        title={col}
                                    >
                                        <span className="block truncate" style={{ maxWidth: `${cellSize}px` }}>{col}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, i) => (
                                <tr key={i}>
                                    <td
                                        className="text-slate-400 font-semibold text-right pr-2 whitespace-nowrap"
                                        style={{ fontSize: "10px" }}
                                        title={columns[i]}
                                    >
                                        <span className="block truncate" style={{ maxWidth: "80px" }}>{columns[i]}</span>
                                    </td>
                                    {row.map((val, j) => (
                                        <td
                                            key={j}
                                            title={`${columns[i]} × ${columns[j]}: ${val}`}
                                            style={{
                                                backgroundColor: getColor(val),
                                                width: `${cellSize}px`,
                                                height: `${cellSize}px`,
                                                border: "1px solid rgba(255,255,255,0.04)",
                                            }}
                                            className="font-bold text-white"
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
                            background: "linear-gradient(to right, rgba(56,189,227,0.8), rgba(30,40,60,0.8), rgba(139,127,247,0.8))"
                        }} />
                        <span>+1</span>
                        <span className="ml-2 text-slate-500">Negative → Positive Correlation</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
