import { useGithub } from '@/providers/Github/Github';
import { useState } from 'react';
import IssueList from '@/components/IssueList/IssueList';

export default function Reporters() {
  const { issues } = useGithub();
  const [stateFilter, setStateFilter] = useState('open');
  const [selectedReporter, setSelectedReporter] = useState(null);

  // Apply state filter
  const filteredIssues = issues?.filter(issue => {
    return (stateFilter === 'all' || issue.state === stateFilter);
  });

  // Calculate reporter statistics
  const reporterStats = filteredIssues?.reduce((stats, issue) => {
    const login = issue.user.login;
    stats[login] = (stats[login] || 0) + 1;
    return stats;
  }, {}) || {};

  // Get issues for selected reporter
  const selectedIssues = filteredIssues?.filter(issue => {
    return issue.user.login === selectedReporter;
  });

  return (
    <div className="flex gap-6">
      <div className="flex flex-col w-96">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Reporters</h1>
          
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="open">Open Issues</option>
            <option value="closed">Closed Issues</option>
            <option value="all">All Issues</option>
          </select>
        </div>
        
        <div className="bg-white rounded shadow w-full">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">&nbsp;</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(reporterStats)
                .sort((a, b) => b[1] - a[1])
                .map(([login, count]) => {
                  const reporter = filteredIssues.find(issue => 
                    issue.user.login === login
                  )?.user;
                  
                  return (
                    <tr 
                      key={login} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedReporter === login ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedReporter(login)}
                    >
                      <td className="px-3 py-2">
                        <img 
                          src={reporter?.avatar_url} 
                          alt={login}
                          className="w-10 h-10 rounded-full ring-1 ring-gray-200"
                        />
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

      <div className="flex-1">
        <IssueList 
          issues={selectedIssues}
          title={selectedReporter 
            ? `Issues Reported by ${selectedReporter} (${selectedIssues?.length || 0})`
            : 'Select a reporter to view issues'}
        />
      </div>
    </div>
  );
}
