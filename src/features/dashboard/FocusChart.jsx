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

export default function FocusChart({ sessions }) {
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
        minutes: 0,
      });
    }

    // Sum up session durations by date
    sessions?.forEach((session) => {
      if (session.duration && session.date) {
        const sessionDate = new Date(session.date);
        const dayIndex = last7Days.findIndex(
          (day) =>
            day.date.toLocaleDateString() === sessionDate.toLocaleDateString()
        );

        if (dayIndex !== -1) {
          // Convert seconds to minutes
          const minutes = Math.round(session.duration / 60);
          last7Days[dayIndex].minutes += minutes;
        }
      }
    });

    return last7Days;
  }, [sessions]);

  // Format tooltip to show hours and minutes
  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-gray-900/95 border border-blue-500/30 rounded-lg p-2 text-xs text-gray-200">
          {formatMinutes(value)}
        </div>
      );
    }
    return null;
  };

  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), 1);

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-blue-500/20 rounded-lg p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Focus Time Analytics
        </h2>
        <p className="text-gray-500 text-sm">
          Your focus time for the last 7 days
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
                value: "Minutes",
                angle: -90,
                position: "insideLeft",
                style: { fill: "rgba(255,255,255,0.5)", fontSize: "12px" },
              }}
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <Bar
              dataKey="minutes"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => {
                // Color bars based on value - gradient from cyan to blue to purple
                const percentage = entry.minutes / maxMinutes;
                let color = "#22d3ee"; // cyan for low
                if (percentage > 0.66) {
                  color = "#6366f1"; // indigo for high
                } else if (percentage > 0.33) {
                  color = "#3b82f6"; // blue for medium
                }
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
            Today
          </p>
          <p className="text-lg font-semibold text-blue-400">
            {formatMinutes(chartData[6].minutes)}
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
            Weekly Total
          </p>
          <p className="text-lg font-semibold text-cyan-400">
            {formatMinutes(chartData.reduce((sum, d) => sum + d.minutes, 0))}
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
            Daily Average
          </p>
          <p className="text-lg font-semibold text-green-400">
            {formatMinutes(
              Math.round(chartData.reduce((sum, d) => sum + d.minutes, 0) / 7)
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
