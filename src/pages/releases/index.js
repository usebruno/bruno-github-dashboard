import { useGithub } from '@/providers/Github/Github';
import Mac from '@/components/Icons/Mac';
import Windows from '@/components/Icons/Windows';
import Linux from '@/components/Icons/Linux';
import { format, parseISO, startOfMonth } from 'date-fns';

export default function Releases() {
  const { releases } = useGithub();

  // Calculate total downloads across all versions and platforms
  const totalStats = releases.reduce((stats, release) => {
    release.assets.forEach(asset => {
      const name = asset.name.toLowerCase();
      if (name.includes('mac')) {
        stats.mac += asset.download_count;
      } else if (name.includes('win')) {
        stats.windows += asset.download_count;
      } else if (name.includes('linux')) {
        stats.linux += asset.download_count;
      }
    });
    return stats;
  }, { mac: 0, windows: 0, linux: 0 });

  // Get platform downloads per version
  const versionStats = releases.map(release => {
    const stats = { 
      version: release.tag_name, 
      date: release.published_at, 
      mac: 0, 
      windows: 0, 
      linux: 0 
    };
    
    release.assets.forEach(asset => {
      const name = asset.name.toLowerCase();
      if (name.includes('mac')) {
        stats.mac += asset.download_count;
      } else if (name.includes('win')) {
        stats.windows += asset.download_count;
      } else if (name.includes('linux')) {
        stats.linux += asset.download_count;
      }
    });

    stats.total = stats.mac + stats.windows + stats.linux;  // Add total
    return stats;
  });

  const totalDownloads = totalStats.mac + totalStats.windows + totalStats.linux;

  // Calculate monthly statistics
  const monthlyStats = releases.reduce((stats, release) => {
    const releaseDate = parseISO(release.published_at);
    const monthKey = format(releaseDate, 'yyyy-MM');
    
    // Initialize month if it doesn't exist
    if (!stats[monthKey]) {
      stats[monthKey] = {
        month: releaseDate,
        releases: 0,
        downloads: 0
      };
    }
    
    // Count release
    stats[monthKey].releases += 1;
    
    // Sum downloads
    release.assets.forEach(asset => {
      stats[monthKey].downloads += asset.download_count;
    });
    
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
          title="Total Downloads"
          value={totalDownloads.toLocaleString()}
          subtitle="Across all platforms"
        />
        <StatCard
          title="Mac"
          value={totalStats.mac.toLocaleString()}
          subtitle={`${((totalStats.mac / totalDownloads) * 100).toFixed(1)}% of total`}
          icon={<Mac width={24} />}
        />
        <StatCard
          title="Windows"
          value={totalStats.windows.toLocaleString()}
          subtitle={`${((totalStats.windows / totalDownloads) * 100).toFixed(1)}% of total`}
          icon={<Windows width={24} />}
        />
        <StatCard
          title="Linux"
          value={totalStats.linux.toLocaleString()}
          subtitle={`${((totalStats.linux / totalDownloads) * 100).toFixed(1)}% of total`}
          icon={<Linux width={24} />}
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
                Total Downloads
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Releases
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
                  {stat.downloads.toLocaleString()}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-right text-gray-500">
                  {stat.releases}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version Stats Table */}
      <div className="bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Release Date
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Downloads
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mac Downloads
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Windows Downloads
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Linux Downloads
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {versionStats.map((stat, index) => (
              <tr key={stat.version} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900">
                  {stat.version}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-500">
                  {format(new Date(stat.date), 'dd, MMM yyyy')}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-right text-gray-500">
                  {stat.total.toLocaleString()}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-right text-gray-500">
                  {stat.mac.toLocaleString()}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-right text-gray-500">
                  {stat.windows.toLocaleString()}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-xs text-right text-gray-500">
                  {stat.linux.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded shadow p-6 relative">
      {icon && (
        <div className="absolute top-6 right-6">
          <div className="text-gray-500">
            {icon}
          </div>
        </div>
      )}
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
    </div>
  );
}
