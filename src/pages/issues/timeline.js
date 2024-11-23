import { useGithub } from '@/providers/Github/Github';
import { useState } from 'react';
import IssueList from '@/components/IssueList/IssueList';

export default function Timeline() {
  const { issues } = useGithub();
  const [stateFilter, setStateFilter] = useState('open');
  const [selectedTimeline, setSelectedTimeline] = useState('short-term-goal');

  // Apply state filter
  const filteredIssues = issues?.filter(issue => {
    return (stateFilter === 'all' || issue.state === stateFilter);
  });

  // Calculate timeline statistics
  const timelineStats = filteredIssues?.reduce((stats, issue) => {
    const timelineLabels = issue.labels.filter(label => 
      ['short-term-goal', 'mid-term-goal', 'long-term-goal'].includes(label.name)
    );
    
    if (timelineLabels.length === 0) {
      stats.notimeline = (stats.notimeline || 0) + 1;
    } else {
      timelineLabels.forEach(label => {
        stats[label.name] = (stats[label.name] || 0) + 1;
      });
    }
    return stats;
  }, {}) || {};

  const timelineOrder = ['short-term-goal', 'mid-term-goal', 'long-term-goal'];

  // Get issues for selected timeline
  const selectedIssues = filteredIssues?.filter(issue => {
    if (!selectedTimeline) return false;
    if (selectedTimeline === 'notimeline') {
      return !issue.labels.some(label => timelineOrder.includes(label.name));
    }
    return issue.labels.some(label => label.name === selectedTimeline);
  });

  return (
    <div className="flex gap-6">
      <div className="flex flex-col w-96">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Timeline</h1>
          
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
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Timeline rows first */}
              {timelineOrder.map(labelName => {
                const count = timelineStats[labelName] || 0;
                const labelObj = filteredIssues?.find(issue => 
                  issue.labels.some(l => l.name === labelName)
                )?.labels.find(l => l.name === labelName);
                
                return (
                  <tr 
                    key={labelName} 
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedTimeline === labelName ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedTimeline(labelName)}
                  >
                    <td className="px-3 py-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: labelObj?.color }}
                      />
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {labelName}
                    </td>
                    <td className="px-3 py-2 text-right">{count}</td>
                  </tr>
                );
              })}

              {/* No Timeline row at the bottom */}
              <tr 
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedTimeline === 'notimeline' ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedTimeline('notimeline')}
              >
                <td className="px-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                </td>
                <td className="px-3 py-2 font-medium">
                  No Timeline
                </td>
                <td className="px-3 py-2 text-right">{timelineStats.notimeline || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Right side issue list */}
      <div className="flex-1">
        <IssueList 
          issues={selectedIssues}
          title={selectedTimeline ? (
            selectedTimeline === 'notimeline' 
              ? `No Timeline Issues (${selectedIssues?.length || 0})` 
              : `${selectedTimeline.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')} Issues (${selectedIssues?.length || 0})`
          ) : 'Select a timeline to view issues'}
        />
      </div>
    </div>
  );
}