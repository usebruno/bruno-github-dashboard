import { useGithub } from '@/providers/Github/Github';
import { useState } from 'react';
import IssueList from '@/components/IssueList/IssueList';

export default function Modules() {
  const { issues } = useGithub();
  const [stateFilter, setStateFilter] = useState('open');
  const [selectedLabel, setSelectedLabel] = useState(null);

  // Apply state filter
  const filteredIssues = issues?.filter(issue => {
    return (stateFilter === 'all' || issue.state === stateFilter);
  });

  // Calculate label statistics
  const labelStats = filteredIssues?.reduce((stats, issue) => {
    const moduleLabels = issue.labels.filter(label => label.name.startsWith('module-'));
    
    if (moduleLabels.length === 0) {
      stats.unlabelled = (stats.unlabelled || 0) + 1;
    } else {
      moduleLabels.forEach(label => {
        stats[label.name] = (stats[label.name] || 0) + 1;
      });
    }
    return stats;
  }, {}) || {};

  // Get issues for selected label
  const selectedIssues = filteredIssues?.filter(issue => {
    if (!selectedLabel) return false;
    if (selectedLabel === 'unlabelled') {
      return !issue.labels.some(label => label.name.startsWith('module-'));
    }
    return issue.labels.some(label => label.name === selectedLabel);
  });

  return (
    <div className="flex gap-6">
      <div className="flex flex-col w-96">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Modules</h1>
          
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
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">&nbsp;</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Unlabelled row - add click handler and highlight */}
              <tr 
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedLabel === 'unlabelled' ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedLabel('unlabelled')}
              >
                <td className="px-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                </td>
                <td className="px-3 py-2 font-medium">
                  Unlabelled
                </td>
                <td className="px-3 py-2 text-right">{labelStats.unlabelled || 0}</td>
              </tr>

              {/* Label rows - add click handler and highlight */}
              {Object.entries(labelStats)
                .filter(([label]) => label !== 'unlabelled')
                .sort((a, b) => b[1] - a[1])
                .map(([label, count]) => {
                  const labelObj = filteredIssues.find(issue => 
                    issue.labels.some(l => l.name === label)
                  )?.labels.find(l => l.name === label);
                  
                  return (
                    <tr 
                      key={label} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedLabel === label ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedLabel(label)}
                    >
                      <td className="px-3 py-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: `#${labelObj?.color}` }}
                        />
                      </td>
                      <td className="px-3 py-2 font-medium">
                        {label}
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
          title={selectedLabel ? (
            selectedLabel === 'unlabelled' 
              ? `Unlabelled Issues (${selectedIssues?.length || 0})` 
              : `Issues for ${selectedLabel} (${selectedIssues?.length || 0})`
          ) : 'Select a module to view issues'}
        />
      </div>
    </div>
  );
}
