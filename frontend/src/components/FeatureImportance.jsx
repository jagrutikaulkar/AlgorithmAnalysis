// FeatureImportance Component (Random Forest only)
// Bar chart using Recharts
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from "recharts";

const COLORS = [
    "#8b7ff7", "#a777e3", "#6e8efb", "#7ec8e3", "#c084fc",
    "#818cf8", "#38bdf8", "#34d399", "#fbbf24", "#f87171",
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-xs text-white shadow-xl">
                <p className="font-bold text-brand-400">{payload[0].payload.feature}</p>
                <p>Importance: <span className="text-white font-semibold">{(payload[0].value * 100).toFixed(2)}%</span></p>
            </div>
        );
    }
    return null;
};

export default function FeatureImportance({ data }) {
    if (!data) return null;

    // Sort by importance descending
    const chartData = data.features
        .map((f, i) => ({ feature: f, importance: data.importances[i] }))
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 15); // top 15

    return (
        <div>
            <p className="section-label">Feature Importance (Random Forest)</p>
            <div className="glass-card p-5">
                <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 28)}>
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4f" horizontal={false} />
                        <XAxis
                            type="number"
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                        />
                        <YAxis
                            type="category"
                            dataKey="feature"
                            width={110}
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(110,94,245,0.08)" }} />
                        <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                            {chartData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
