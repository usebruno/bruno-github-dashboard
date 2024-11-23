export default function IssueList({ issues, title }) {
  const getContrastColor = (hexcolor) => {
    // Convert hex to RGB
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? '#000' : '#fff';
  };

  return (
    <div className="bg-white rounded shadow">
      <div className="px-4 py-3 border-b">
        <h2 className="font-medium">{title}</h2>
      </div>
      {issues && (
        <div className="divide-y">
          {issues.map(issue => (
            <div key={issue.number} className="px-4 py-3 hover:bg-gray-50">
              <a 
                href={issue.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-900 hover:text-blue-600 hover:underline"
              >
                {issue.title}
              </a>
              <div className="flex items-center justify-between text-xs mt-1">
                <div className="flex items-center gap-4 text-gray-500">
                  <span>#{issue.number} by {issue.user.login}</span>
                  {issue.reactions.total_count > 0 && (
                    <span>👍 {issue.reactions.total_count} reactions</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {issue.labels.map(label => (
                    <span
                      key={label.id}
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{ 
                        backgroundColor: `#${label.color}`, 
                        color: getContrastColor(label.color) 
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {issues.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No issues found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
