import { useGithub } from '@/providers/Github/Github';
import { useState } from 'react';
import IssueList from '@/components/IssueList/IssueList';

export default function Assignees() {
  const { issues } = useGithub();
  const [stateFilter, setStateFilter] = useState('open');
  const [termFilter, setTermFilter] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState(null);

  // Apply state and term filters
  const filteredIssues = issues?.filter(issue => {
    const stateMatches = stateFilter === 'all' || issue.state === stateFilter;
    
    let termMatches = true;
    if (termFilter !== 'all') {
      const labelName = `${termFilter}-term-goal`;
      termMatches = issue.labels.some(label => label.name === labelName);
    }
    
    return stateMatches && termMatches;
  });

  // Calculate assignee statistics
  const assigneeStats = filteredIssues?.reduce((stats, issue) => {
    if (!issue.assignees?.length) {
      stats.unassigned = (stats.unassigned || 0) + 1;
    } else {
      issue.assignees.forEach(assignee => {
        stats[assignee.login] = (stats[assignee.login] || 0) + 1;
      });
    }
    return stats;
  }, {}) || {};

  // Get issues for selected assignee
  const selectedIssues = filteredIssues?.filter(issue => {
    if (!selectedAssignee) return false;
    if (selectedAssignee === 'unassigned') {
      return !issue.assignees?.length;
    }
    return issue.assignees?.some(assignee => assignee.login === selectedAssignee);
  });

  return (
    <div className="flex gap-6">
      <div className="flex flex-col w-96">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Assignees</h1>
          
          <div className="flex gap-2">
            <select
              value={termFilter}
              onChange={(e) => setTermFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Issues</option>
              <option value="short">Short Term</option>
              <option value="mid">Mid Term</option>
              <option value="long">Long Term</option>
            </select>

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
        </div>
        
        <div className="bg-white rounded shadow w-full">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">&nbsp;</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Unassigned row - add click handler and highlight */}
              <tr 
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedAssignee === 'unassigned' ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedAssignee('unassigned')}
              >
                <td className="px-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300" />
                </td>
                <td className="px-3 py-2 font-medium">
                  Unassigned
                </td>
                <td className="px-3 py-2 text-right">{assigneeStats.unassigned || 0}</td>
              </tr>

              {/* Assignee rows - add click handler and highlight */}
              {Object.entries(assigneeStats)
                .filter(([login]) => login !== 'unassigned')
                .sort((a, b) => b[1] - a[1])
                .map(([login, count]) => {
                  const assignee = filteredIssues.find(issue => 
                    issue.assignees?.some(a => a.login === login)
                  )?.assignees?.find(a => a.login === login);
                  
                  return (
                    <tr 
                      key={login} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedAssignee === login ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedAssignee(login)}
                    >
                      <td className="px-3 py-2">
                        <img 
                          src={assignee?.avatar_url} 
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

      {/* Add right side issue list */}
      <div className="flex-1">
        <IssueList 
          issues={selectedIssues}
          title={selectedAssignee ? (
            selectedAssignee === 'unassigned' 
              ? `Unassigned Issues (${selectedIssues?.length || 0})` 
              : `Issues Assigned to ${selectedAssignee} (${selectedIssues?.length || 0})`
          ) : 'Select an assignee to view issues'}
        />
      </div>
    </div>
  );
}
