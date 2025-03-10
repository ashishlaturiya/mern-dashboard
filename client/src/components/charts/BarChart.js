import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChart = ({ data, xDataKey, bars, title }) => {
  const colors = ['#38B2AC', '#4299E1', '#805AD5', '#DD6B20', '#F6E05E'];
  
  return (
    <Box
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      p={4}
      boxShadow="md"
      w="100%"
      h="100%"
    >
      {title && <Box fontSize="lg" fontWeight="semibold" mb={4}>{title}</Box>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {bars.map((bar, index) => (
            <Bar 
              key={bar.dataKey} 
              dataKey={bar.dataKey} 
              name={bar.name || bar.dataKey} 
              fill={bar.fill || colors[index % colors.length]} 
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChart;