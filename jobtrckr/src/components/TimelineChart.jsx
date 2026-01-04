import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function TimelineChart({ apps }) {
  const chartData = useMemo(() => {
    // Group applications by week
    const groupedByWeek = {};

    apps.forEach(app => {
      if (!app.applied_date) return;

      const date = new Date(app.applied_date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());

      const weekKey = weekStart.toISOString().split("T")[0];

      if (!groupedByWeek[weekKey]) {
        groupedByWeek[weekKey] = 0;
      }
      groupedByWeek[weekKey]++;
    });

    // Convert to array and sort by date
    const lineChartData = Object.entries(groupedByWeek)
      .map(([week, count]) => ({
        week: new Date(week).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count,
      }))
      .sort(
        (a, b) =>
          new Date(a.week).getTime() - new Date(b.week).getTime()
      );

    // Group applications by status
    const statusDistribution = {};
    const statusColors = {
      Applied: "#a78bfa",
      "Interview Scheduled": "#fbbf24",
      Interviewed: "#eab308",
      Offer: "#10b981",
      Rejected: "#ef4444",
    };

    apps.forEach(app => {
      const status = app.status || "Unknown";
      if (!statusDistribution[status]) {
        statusDistribution[status] = 0;
      }
      statusDistribution[status]++;
    });

    const barChartData = Object.entries(statusDistribution)
      .map(([status, count]) => ({
        status,
        count,
        fill: statusColors[status] || "#6b7280",
      }))
      .sort((a, b) => b.count - a.count);

    return { lineChartData, barChartData };
  }, [apps]);

  return (
    <div className="flex flex-col h-full min-h-96 lg:min-h-full">
      {/* Timeline Section */}
      <div className="flex-1 flex flex-col border-b border-zinc-800 min-h-48">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <h3 className="text-lg font-semibold tracking-tight">
            Applications Over Time
          </h3>
        </div>

        {/* Chart */}
        <div className="flex-1 p-6 flex items-center justify-center min-h-0">
          {chartData.lineChartData.length === 0 ? (
            <div className="flex items-center justify-center text-zinc-400">
              <p className="text-sm">No application data to display</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={chartData.lineChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#3f3f46"
                />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#27272a",
                    border: "1px solid #3f3f46",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#e4e4e7" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={{ fill: "#a78bfa", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Status Distribution Section */}
      <div className="flex-1 flex flex-col min-h-48">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <h3 className="text-lg font-semibold tracking-tight">
            Status Distribution
          </h3>
        </div>

        {/* Chart */}
        <div className="flex-1 p-6 flex items-center justify-center min-h-0">
          {chartData.barChartData.length === 0 ? (
            <div className="flex items-center justify-center text-zinc-400">
              <p className="text-sm">No application data to display</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={chartData.barChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#3f3f46"
                />
                <XAxis dataKey="status" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#27272a",
                    border: "1px solid #3f3f46",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#e4e4e7" }}
                />
                <Bar
                  dataKey="count"
                  fill="#a78bfa"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
