import { useGithub } from '@/providers/Github/Github';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Insights() {
  const { issues } = useGithub();
  const [openedChartData, setOpenedChartData] = useState(null);
  const [closedChartData, setClosedChartData] = useState(null);
  
  useEffect(() => {
    if (!issues || issues.length === 0) return;
    
    // Calculate monthly opened statistics
    const monthlyOpened = issues.reduce((stats, issue) => {
      const createdDate = parseISO(issue.created_at);
      const monthKey = format(createdDate, 'yyyy-MM');
      
      if (!stats[monthKey]) {
        stats[monthKey] = {
          month: format(createdDate, 'MMM yyyy'),
          count: 0,
          date: createdDate, // Keep the date for sorting
        };
      }
      
      stats[monthKey].count++;
      return stats;
    }, {});
    
    // Convert to array and sort by date (oldest first)
    const openedDataArray = Object.values(monthlyOpened)
      .sort((a, b) => a.date - b.date);
    
    // Prepare data for Chart.js (opened issues chart)
    const openedData = {
      labels: openedDataArray.map(item => item.month),
      datasets: [
        {
          label: 'Opened Issues',
          data: openedDataArray.map(item => item.count),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    setOpenedChartData(openedData);
    
    // Calculate monthly closed statistics
    const monthlyClosed = issues.reduce((stats, issue) => {
      // Only count issues that are closed
      if (!issue.closed_at) return stats;
      
      const closedDate = parseISO(issue.closed_at);
      const monthKey = format(closedDate, 'yyyy-MM');
      
      if (!stats[monthKey]) {
        stats[monthKey] = {
          month: format(closedDate, 'MMM yyyy'),
          count: 0,
          date: closedDate, // Keep the date for sorting
        };
      }
      
      stats[monthKey].count++;
      return stats;
    }, {});
    
    // Convert to array and sort by date (oldest first)
    const closedDataArray = Object.values(monthlyClosed)
      .sort((a, b) => a.date - b.date);
    
    // Prepare data for Chart.js (closed issues chart)
    const closedData = {
      labels: closedDataArray.map(item => item.month),
      datasets: [
        {
          label: 'Closed Issues',
          data: closedDataArray.map(item => item.count),
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    setClosedChartData(closedData);
  }, [issues]);
  
  const openedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Issues Opened by Month',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Opened Issues: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Opened Issues',
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };
  
  const closedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Issues Closed by Month',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Closed Issues: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Closed Issues',
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded shadow p-6">
        <div className="text-sm font-medium text-gray-500 mb-4">
          Monthly Issue Opening Trends
        </div>
        <div className="h-96">
          {openedChartData ? (
            <Bar data={openedChartData} options={openedChartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded shadow p-6">
        <div className="text-sm font-medium text-gray-500 mb-4">
          Monthly Issue Closure Trends
        </div>
        <div className="h-96">
          {closedChartData ? (
            <Bar data={closedChartData} options={closedChartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
