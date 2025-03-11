import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const DataChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <Text>No data to display</Text>;
  }
  
  // Automatically determine which fields to use for x-axis and y-axis
  const fields = Object.keys(data[0]);
  
  // Find date/string field for x-axis
  const xField = fields.find(field => {
    const value = data[0][field];
    return typeof value === 'string' || value instanceof Date || !isNaN(Date.parse(value));
  }) || fields[0];
  
  // Find numeric fields for y-axis
  const yFields = fields.filter(field => {
    return typeof data[0][field] === 'number' && field !== xField;
  });
  
  if (yFields.length === 0) {
    return <Text>No numeric data available for charting</Text>;
  }
  
  // Choose chart type: Line chart for time series, Bar chart otherwise
  const isTimeSeries = data.every(item => !isNaN(Date.parse(item[xField])));
  
  // Use teal color scheme to match dashboard
  const colors = ['#38B2AC', '#319795', '#2C7A7B', '#285E61', '#234E52'];
  
  return (
    <Box h="400px" w="100%">
      <ResponsiveContainer width="100%" height="100%">
        {isTimeSeries ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey={xField} tick={{ fill: '#4A5568' }} />
            <YAxis tick={{ fill: '#4A5568' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E2E8F0',
                borderRadius: '4px'
              }} 
            />
            <Legend />
            {yFields.map((field, index) => (
              <Line 
                key={field} 
                type="monotone" 
                dataKey={field} 
                stroke={colors[index % colors.length]} 
                activeDot={{ r: 8 }} 
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey={xField} tick={{ fill: '#4A5568' }} />
            <YAxis tick={{ fill: '#4A5568' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E2E8F0',
                borderRadius: '4px'
              }} 
            />
            <Legend />
            {yFields.map((field, index) => (
              <Bar 
                key={field} 
                dataKey={field} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default DataChart;