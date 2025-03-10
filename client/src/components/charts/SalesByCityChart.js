import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesByCityChart = ({ data }) => {
  if (!data || data.length === 0) return <div>Loading sales data...</div>;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by City',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: data.map(item => item.city),
    datasets: [
      {
        label: 'Number of Sales',
        data: data.map(item => item.totalSales),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Average Price (SGD 10k)',
        data: data.map(item => item.avgPrice / 10000), // Scaled for better visualization
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Bar options={options} data={chartData} />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map(city => (
          <div key={city.city} className="border rounded-md p-3">
            <h4 className="font-semibold">{city.city}</h4>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>
                <div className="text-gray-500">Sales</div>
                <div className="font-medium">{city.totalSales}</div>
              </div>
              <div>
                <div className="text-gray-500">Avg. Price</div>
                <div className="font-medium">${(city.avgPrice).toLocaleString()}</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500">Total Revenue</div>
                <div className="font-medium">${(city.totalRevenue).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesByCityChart;