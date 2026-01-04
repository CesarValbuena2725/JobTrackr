import { useMemo } from "react";

export default function StatsCard({ apps, refreshKey }) {
  const stats = useMemo(() => {
    const totalApplications = apps.length;
    const interviewsSecured = apps.filter(
      app => app.status.includes("Interview") || app.status === "Offer"
    );
    const pendingResponses = apps.filter(app => app.status === "Applied");
    const successRate =
      totalApplications > 0
        ? Math.round((interviewsSecured.length / totalApplications) * 100)
        : 0;

    return {
      totalApplications,
      interviewsSecured,
      pendingResponses,
      successRate,
    };
  }, [apps, refreshKey]);

  return (
    <section className="h-fit w-full">
      <div className="bg-zinc-900 text-zinc-100 rounded-xl shadow-lg shadow-black/40 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <h3 className="text-lg font-semibold tracking-tight">
            Your stats
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-800 text-zinc-400 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Interviews</th>
                <th className="px-4 py-3 text-left">Pending</th>
                <th className="px-4 py-3 text-left">Success %</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {apps.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-zinc-400"
                  >
                    <p className="text-sm">No applications yet.</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Add some applications to see your stats.
                    </p>
                  </td>
                </tr>
              ) : (
                <tr
                  className="
                    hover:bg-zinc-800/50
                    transition-all duration-300 ease-out
                  "
                >
                  <td className="px-4 py-3 text-sm font-medium">
                    {stats.totalApplications}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {stats.interviewsSecured.length}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {stats.pendingResponses.length}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className="
                        inline-flex items-center px-3 py-1 rounded-xl
                        text-xs font-medium
                        bg-emerald-500/20 text-emerald-300
                        shadow shadow-black/30
                      "
                    >
                      {stats.successRate}%
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
