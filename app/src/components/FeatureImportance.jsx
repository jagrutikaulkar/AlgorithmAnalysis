// FeatureImportance — horizontal bar chart using Recharts (Random Forest only)
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const COLORS = ["#8b7ff7", "#a777e3", "#6e8efb", "#7ec8e3", "#c084fc", "#818cf8", "#38bdf8", "#34d399", "#fbbf24", "#f87171"];

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-xs text-white shadow-xl">
            <p className="font-bold text-brand-400 mb-0.5">{payload[0].payload.feature}</p>
            <p>Importance: <strong>{(payload[0].value * 100).toFixed(2)}%</strong></p>
        </div>
    );
};

export default function FeatureImportance({ data }) {
    if (!data) return null;

    const chartData = data.features
        .map((f, i) => ({ feature: f, importance: data.importances[i] }))
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 15);

    return (
        <div>
            <p className="section-label">Feature Importance (Random Forest)</p>
            <div className="glass-card p-5">
                <ResponsiveContainer width="100%" height={Math.max(220, chartData.length * 30)}>
                    <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4f" horizontal={false} />
                        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} axisLine={false}
                            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <YAxis type="category" dataKey="feature" width={120} tick={{ fill: "#94a3b8", fontSize: 10 }}
                            tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(110,94,245,0.08)" }} />
                        <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
