// ConfusionMatrix — color-scaled table heatmap
import { useMemo } from "react";

export default function ConfusionMatrix({ data }) {
    if (!data) return null;
    const { labels, matrix } = data;
    const maxVal = useMemo(() => Math.max(...matrix.flat(), 1), [matrix]);

    const getColor = (val) => {
        const t = val / maxVal;
        return `rgba(110, 94, 245, ${0.1 + t * 0.75})`;
    };

    const cellPx = Math.min(60, Math.floor(480 / (labels.length + 1)));

    return (
        <div>
            <p className="section-label">Confusion Matrix</p>
            <div className="glass-card p-5 overflow-x-auto">
                <table className="border-collapse text-center mx-auto" style={{ fontSize: "11px" }}>
                    <thead>
                        <tr>
                            <th className="text-slate-500 px-2 py-1 text-right text-xs font-normal italic pr-3">True ↓ Pred →</th>
                            {labels.map((l) => (
                                <th key={l} className="text-slate-400 font-semibold px-2 py-1 whitespace-nowrap">{l}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={i}>
                                <td className="text-slate-400 font-semibold pr-3 py-1 text-right whitespace-nowrap">{labels[i]}</td>
                                {row.map((val, j) => (
                                    <td
                                        key={j}
                                        title={`True: ${labels[i]}, Pred: ${labels[j]} → ${val}`}
                                        style={{
                                            backgroundColor: getColor(val),
                                            width: `${cellPx}px`,
                                            height: `${cellPx}px`,
                                            border: "1px solid rgba(255,255,255,0.05)",
                                        }}
                                        className={`font-bold ${i === j ? "text-white" : "text-slate-300"}`}
                                    >
                                        {val}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="text-xs text-slate-500 text-center mt-3">Diagonal = correct predictions · darker = higher count</p>
            </div>
        </div>
    );
}
