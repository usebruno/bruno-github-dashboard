import { useGithub } from '@/providers/Github/Github';
import { 
  CodeBracketIcon,
  TagIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  CloudArrowDownIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { issues, prs, releases } = useGithub();
  
  // Calculate statistics
  const totalDownloads = releases?.reduce((total, release) => {
    const releaseDownloads = release.assets.reduce((sum, asset) => sum + asset.download_count, 0);
    return total + releaseDownloads;
  }, 0) || 0;
  const openIssuesCount = issues?.filter((issue) => {
    return issue.state === 'open';
  })?.length || 0;
  const openPRsCount = prs?.filter(pr => pr?.state === 'open')?.length || 0;
  const latestVersion = releases?.[0]?.tag_name || 'v0.0.0';
  const latestRelease = releases?.[0];

  // Get PR statistics
  const recentPRs = prs?.slice(0, 5) || [];
  
  return (
    <div className="p-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="All Time Downloads"
          value={totalDownloads.toLocaleString()}
          icon={<CloudArrowDownIcon />}
        />
        <StatCard
          title="Open Issues"
          value={openIssuesCount}
          icon={<ExclamationCircleIcon />}
        />
        <StatCard
          title="Open PRs"
          value={openPRsCount}
          icon={<CodeBracketIcon />}
        />
        <StatCard
          title="Latest Version"
          value={latestVersion}
          icon={<TagIcon />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent PRs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Pull Requests</h2>
          <div className="space-y-4">
            {recentPRs.map(pr => (
              <div key={pr.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                <img 
                  src={pr.user.avatar_url} 
                  alt={pr.user.login}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <a 
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {pr.title}
                  </a>
                  <div className="text-sm text-gray-500">
                    #{pr.number} opened by {pr.user.login}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Release */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Latest Release Details</h2>
          {latestRelease && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium">{latestRelease.name}</h3>
                <p className="text-sm text-gray-500">
                  Released on {new Date(latestRelease.published_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Downloads by Platform</h4>
                {latestRelease.assets.map(asset => (
                  <div key={asset.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{asset.name}</span>
                    <span className="text-sm font-medium">{asset.download_count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <div className="w-6 h-6 text-blue-600">
            {icon}
          </div>
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
