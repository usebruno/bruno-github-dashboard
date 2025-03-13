import { useGithub } from '@/providers/Github/Github';
import { useState } from 'react';
import PRList from '@/components/PRList/PRList';

export default function Authors() {
  const { prs } = useGithub();
  const [stateFilter, setStateFilter] = useState('open');
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  // Apply state filter
  const filteredPRs = prs?.filter(pr => {
    return stateFilter === 'all' || pr.state === stateFilter;
  });

  // Calculate author statistics
  const authorStats = filteredPRs?.reduce((stats, pr) => {
    const author = pr.user.login;
    stats[author] = (stats[author] || 0) + 1;
    return stats;
  }, {}) || {};

  // Get PRs for selected author
  const selectedPRs = filteredPRs?.filter(pr => {
    if (!selectedAuthor) return false;
    return pr.user.login === selectedAuthor;
  });

  return (
    <div className="flex gap-6">
      <div className="flex flex-col w-96">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">PR Authors</h1>
          
          <div className="flex gap-2">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="open">Open PRs</option>
              <option value="closed">Closed PRs</option>
              <option value="all">All PRs</option>
            </select>
          </div>
        </div>
        
        <div className="bg-white rounded shadow w-full">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">&nbsp;</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(authorStats)
                .sort((a, b) => b[1] - a[1])
                .map(([login, count]) => {
                  const author = filteredPRs.find(pr => pr.user.login === login)?.user;
                  
                  return (
                    <tr 
                      key={login} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedAuthor === login ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedAuthor(login)}
                    >
                      <td className="px-3 py-2">
                        <div className="w-10 h-10 relative overflow-hidden flex-shrink-0">
                          <img 
                            src={author?.avatar_url} 
                            alt={login}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                            style={{ aspectRatio: '1/1' }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2 font-medium">
                        {login}
                      </td>
                      <td className="px-3 py-2 text-right">{count}</td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right side PR list */}
      <div className="flex-1">
        <PRList 
          prs={selectedPRs}
          title={selectedAuthor ? 
            `PRs by ${selectedAuthor} (${selectedPRs?.length || 0})` : 
            'Select an author to view PRs'
          }
        />
      </div>
    </div>
  );
} 