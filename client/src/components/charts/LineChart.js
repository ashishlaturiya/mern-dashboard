import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChart = ({ data, xDataKey, lines, title }) => {
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
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map((line, index) => (
            <Line 
              key={line.dataKey} 
              type="monotone" 
              dataKey={line.dataKey} 
              name={line.name || line.dataKey} 
              stroke={line.stroke || colors[index % colors.length]} 
              activeDot={{ r: 8 }} 
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LineChart;