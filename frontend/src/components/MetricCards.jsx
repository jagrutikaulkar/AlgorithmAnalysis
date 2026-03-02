// MetricCards Component
// Displays Accuracy, Precision, Recall, F1 Score in styled cards
export default function MetricCards({ metrics, algorithm, trainSamples, testSamples }) {
    if (!metrics) return null;

    const cards = [
        { label: "Accuracy", value: metrics.accuracy, icon: "🎯", color: "from-violet-500/20 border-violet-500/40 text-violet-400" },
        { label: "Precision", value: metrics.precision, icon: "🔬", color: "from-sky-500/20 border-sky-500/40 text-sky-400" },
        { label: "Recall", value: metrics.recall, icon: "📡", color: "from-emerald-500/20 border-emerald-500/40 text-emerald-400" },
        { label: "F1 Score", value: metrics.f1_score, icon: "⚡", color: "from-amber-500/20 border-amber-500/40 text-amber-400" },
    ];

    return (
        <div>
            {/* Training Summary */}
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3 text-sm text-emerald-400 font-medium">
                ✅ <span className="font-bold">{algorithm}</span> trained on{" "}
                <span className="font-bold">{trainSamples}</span> samples &bull; Evaluated on{" "}
                <span className="font-bold">{testSamples}</span> test samples
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map(({ label, value, icon, color }) => (
                    <div
                        key={label}
                        className={`glass-card p-5 flex flex-col items-center justify-center gap-1 bg-gradient-to-b ${color} border`}
                    >
                        <span className="text-2xl">{icon}</span>
                        <span className={`text-3xl font-extrabold`}>
                            {(value * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
