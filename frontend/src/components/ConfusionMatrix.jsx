// ConfusionMatrix Component
// Renders the confusion matrix as a visual heatmap using recharts + custom SVG cells
import { useMemo } from "react";

export default function ConfusionMatrix({ data }) {
    if (!data) return null;
    const { labels, matrix } = data;

    // Find max value for color scaling
    const maxVal = useMemo(() => Math.max(...matrix.flat()), [matrix]);

    const getColor = (val) => {
        const t = val / (maxVal || 1);
        // Interpolate from dark surface to vivid purple
        const r = Math.round(110 + (110 - 110) * t);
        const g = Math.round(94 - 94 * t);
        const b = Math.round(245 * t + 35 * (1 - t));
        const alpha = 0.15 + t * 0.7;
        return `rgba(${r},${g},${b},${alpha})`;
    };

    const cellSize = Math.min(64, Math.floor(440 / (labels.length + 1)));

    return (
        <div>
            <p className="section-label">Confusion Matrix</p>
            <div className="glass-card p-5 overflow-x-auto">
                <div className="inline-block">
                    <table className="border-collapse text-center text-xs">
                        <thead>
                            <tr>
                                <th className="text-slate-500 text-xs px-2 py-1" />
                                {labels.map((l) => (
                                    <th key={l} className="text-slate-400 font-semibold px-3 py-1 text-xs whitespace-nowrap">
                                        {l}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, i) => (
                                <tr key={i}>
                                    <td className="text-slate-400 font-semibold pr-3 py-1 text-xs whitespace-nowrap text-right">
                                        {labels[i]}
                                    </td>
                                    {row.map((val, j) => (
                                        <td
                                            key={j}
                                            style={{
                                                backgroundColor: getColor(val),
                                                width: `${cellSize}px`,
                                                height: `${cellSize}px`,
                                                border: "1px solid rgba(255,255,255,0.05)",
                                            }}
                                            className="font-bold text-white rounded transition-all"
                                        >
                                            {val}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Axis labels */}
                    <div className="flex justify-between mt-3 text-xs text-slate-500">
                        <span>← True Label (rows)</span>
                        <span>Predicted Label (cols) →</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
