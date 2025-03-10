import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderAnalysisChart = ({ data, city }) => {
  if (!data || data.length === 0) return <div>Loading gender data...</div>;

  // Group data by gender
  const genderGroups = data.reduce((acc, item) => {
    if (!acc[item.gender]) {
      acc[item.gender] = {
        totalSales: 0,
        totalRevenue: 0,
        avgNps: 0,
        count: 0
      };
    }
    
    acc[item.gender].totalSales += item.totalSales;
    acc[item.gender].totalRevenue += item.totalRevenue;
    acc[item.gender].avgNps += item.avgNps * item.totalSales; // Weighted average
    acc[item.gender].count += item.totalSales;
    
    return acc;
  }, {});
  
  // Calculate final averages
  Object.keys(genderGroups).forEach(gender => {
    if (genderGroups[gender].count > 0) {
      genderGroups[gender].avgNps = genderGroups[gender].avgNps / genderGroups[gender].count;
    }
  });
  
  const genders = Object.keys(genderGroups);
  const salesData = genders.map(gender => genderGroups[gender].totalSales);
  // const revenueData = genders.map(gender => genderGroups[gender].totalRevenue);

  const pieData = {
    labels: genders,
    datasets: [
      {
        data: salesData,
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Sales by Gender ${city !== 'all' ? `in ${city}` : '(All Cities)'}`,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const percentage = ((context.raw / salesData.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <Pie data={pieData} options={options} />
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <h3 className="text-lg font-semibold mb-3">Gender Analysis Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg NPS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {genders.map(gender => (
                  <tr key={gender}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{genderGroups[gender].totalSales}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${genderGroups[gender].totalRevenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{genderGroups[gender].avgNps.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderAnalysisChart;