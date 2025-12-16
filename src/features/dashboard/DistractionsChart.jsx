import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function DistractionsChart({ sessions }) {
  const chartData = useMemo(() => {
    // Get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date,
        dateStr: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        distractions: 0,
      });
    }

    // Sum up distractions by date
    sessions?.forEach((session) => {
      if (session.date) {
        const sessionDate = new Date(session.date);
        const dayIndex = last7Days.findIndex(
          (day) =>
            day.date.toLocaleDateString() === sessionDate.toLocaleDateString()
        );

        if (dayIndex !== -1) {
          const distractionCount = (session.distractions || []).length;
          last7Days[dayIndex].distractions += distractionCount;
        }
      }
    });

    return last7Days;
  }, [sessions]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-gray-900/95 border border-red-500/30 rounded-lg p-2 text-xs text-gray-200">
          {value} distraction{value !== 1 ? "s" : ""}
        </div>
      );
    }
    return null;
  };

  const maxDistractions = Math.max(...chartData.map((d) => d.distractions), 1);

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-red-500/20 rounded-lg p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
          Distraction Tracking
        </h2>
        <p className="text-gray-500 text-sm">
          Number of distractions detected for the last 7 days
        </p>
      </div>

      <div className="w-full h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 40, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="dateStr"
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                style: { fill: "rgba(255,255,255,0.5)", fontSize: "12px" },
              }}
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <Bar
              dataKey="distractions"
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => {
                // Color bars based on value - gradient from orange to red
                const percentage = entry.distractions / maxDistractions;
                let color = "#fbbf24"; // amber for low
                if (percentage > 0.66) {
                  color = "#dc2626"; // red-600 for high
                } else if (percentage > 0.33) {
                  color = "#f97316"; // orange-500 for medium
                }
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
            Today
          </p>
          <p className="text-lg font-semibold text-red-400">
            {chartData[6].distractions}
          </p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
            Weekly Total
          </p>
          <p className="text-lg font-semibold text-orange-400">
            {chartData.reduce((sum, d) => sum + d.distractions, 0)}
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
            Daily Average
          </p>
          <p className="text-lg font-semibold text-amber-400">
            {Math.round(chartData.reduce((sum, d) => sum + d.distractions, 0) / 7)}
          </p>
        </div>
      </div>
    </div>
  );
}
