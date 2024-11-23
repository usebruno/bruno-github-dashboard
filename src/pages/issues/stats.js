import { useGithub } from '@/providers/Github/Github';
import { format, parseISO } from 'date-fns';

export default function IssuesStats() {
  const { issues } = useGithub();

  // Calculate total stats
  const totalStats = {
    total: issues.length,
    open: issues.filter(issue => issue.state === 'open').length,
    closed: issues.filter(issue => issue.state === 'closed').length
  };

  // Calculate monthly statistics
  const monthlyStats = issues.reduce((stats, issue) => {
    const createdDate = parseISO(issue.created_at);
    const monthKey = format(createdDate, 'yyyy-MM');
    const closedDate = issue.closed_at ? parseISO(issue.closed_at) : null;
    const closedMonthKey = closedDate ? format(closedDate, 'yyyy-MM') : null;
    
    // Initialize month if it doesn't exist
    if (!stats[monthKey]) {
      stats[monthKey] = {
        month: createdDate,
        newIssues: 0,
        closedIssues: 0
      };
    }
    
    // Count new issue
    stats[monthKey].newIssues += 1;
    
    // Count closed issue in its respective month
    if (closedMonthKey) {
      if (!stats[closedMonthKey]) {
        stats[closedMonthKey] = {
          month: closedDate,
          newIssues: 0,
          closedIssues: 0
        };
      }
      stats[closedMonthKey].closedIssues += 1;
    }
    
    return stats;
  }, {});

  // Convert to array and sort by date (newest first)
  const monthlyStatsArray = Object.values(monthlyStats)
    .sort((a, b) => b.month - a.month);

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Issues"
          value={totalStats.total.toLocaleString()}
          subtitle="All time"
        />
        <StatCard
          title="Open Issues"
          value={totalStats.open.toLocaleString()}
          subtitle={`${((totalStats.open / totalStats.total) * 100).toFixed(1)}% of total`}
        />
        <StatCard
          title="Closed Issues"
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
                New Issues
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Closed Issues
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
                  {stat.newIssues.toLocaleString()}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-right text-gray-500">
                  {stat.closedIssues.toLocaleString()}
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
