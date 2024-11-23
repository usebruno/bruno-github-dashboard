import { useGithub } from '@/providers/Github/Github';
import { format, parseISO } from 'date-fns';

export default function PullRequests() {
  const { prs } = useGithub();

  // Calculate total stats
  const totalStats = prs.reduce((stats, pr) => {
    stats.total++;
    
    if (pr.state === 'open') {
      stats.open++;
    } else if (pr.merged_at) {
      stats.merged++;
    } else if (pr.closed_at) {
      stats.closed++;
    }
    
    return stats;
  }, { total: 0, open: 0, merged: 0, closed: 0 });


  // Calculate monthly statistics
  const monthlyStats = prs.reduce((stats, pr) => {
    const prDate = parseISO(pr.created_at);
    const monthKey = format(prDate, 'yyyy-MM');
    
    if (!stats[monthKey]) {
      stats[monthKey] = {
        month: prDate,
        total: 0,
        open: 0,
        merged: 0,
        closed: 0
      };
    }
    
    stats[monthKey].total++;
    
    if (pr.state === 'open') {
      stats[monthKey].open++;
    } else if (pr.state === 'closed' && pr.merged_at) {
      stats[monthKey].merged++;
    } else if (pr.state === 'closed') {
      stats[monthKey].closed++;
    }
    
    return stats;
  }, {});

  // Convert to array and sort by date (newest first)
  const monthlyStatsArray = Object.values(monthlyStats)
    .sort((a, b) => b.month - a.month);

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total PRs"
          value={totalStats.total.toLocaleString()}
          subtitle="All time"
        />
        <StatCard
          title="Open PRs"
          value={totalStats.open.toLocaleString()}
          subtitle={`${((totalStats.open / totalStats.total) * 100).toFixed(1)}% of total`}
        />
        <StatCard
          title="Merged PRs"
          value={totalStats.merged.toLocaleString()}
          subtitle={`${((totalStats.merged / totalStats.total) * 100).toFixed(1)}% of total`}
        />
        <StatCard
          title="Closed PRs"
          value={totalStats.closed.toLocaleString()}
          subtitle={`${((totalStats.closed / totalStats.total) * 100).toFixed(1)}% of total`}
        />
      </div>

      {/* Monthly Stats Table */}
      <div className="bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total PRs
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Open PRs
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Merged PRs
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Closed PRs
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlyStatsArray.map((stat, index) => (
              <tr key={format(stat.month, 'yyyy-MM')} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900">
                  {format(stat.month, 'MMMM yyyy')}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-right text-gray-500">
                  {stat.total.toLocaleString()}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-right text-gray-500">
                  {stat.open.toLocaleString()}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-right text-gray-500">
                  {stat.merged.toLocaleString()}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-right text-gray-500">
                  {stat.closed.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded shadow p-6">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
    </div>
  );
}