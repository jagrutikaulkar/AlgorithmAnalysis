// MetricCards — Accuracy, Precision, Recall, F1-Score
export default function MetricCards({ metrics, algorithm, trainSamples, testSamples }) {
    if (!metrics) return null;
    const cards = [
        { label: "Accuracy", value: metrics.accuracy, emoji: "🎯", color: "from-violet-500/20 border-violet-500/40 text-violet-300" },
        { label: "Precision", value: metrics.precision, emoji: "🔬", color: "from-sky-500/20 border-sky-500/40 text-sky-300" },
        { label: "Recall", value: metrics.recall, emoji: "📡", color: "from-emerald-500/20 border-emerald-500/40 text-emerald-300" },
        { label: "F1 Score", value: metrics.f1_score, emoji: "⚡", color: "from-amber-500/20 border-amber-500/40 text-amber-300" },
    ];
    return (
        <div>
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-medium">
                ✅ <strong>{algorithm}</strong> trained on <strong>{trainSamples}</strong> samples · tested on <strong>{testSamples}</strong>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map(({ label, value, emoji, color }) => (
                    <div key={label} className={`glass-card bg-gradient-to-b ${color} border p-5 flex flex-col items-center gap-1 text-center`}>
                        <span className="text-2xl">{emoji}</span>
                        <span className="text-3xl font-extrabold">{(value * 100).toFixed(1)}%</span>
                        <span className="text-xs text-slate-400 uppercase tracking-widest">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
