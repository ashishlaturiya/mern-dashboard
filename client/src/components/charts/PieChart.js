import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PieChart = ({ data, nameKey, dataKey, title, colors }) => {
  const defaultColors = ['#38B2AC', '#4299E1', '#805AD5', '#DD6B20', '#F6E05E', '#FC8181', '#68D391', '#63B3ED'];
  const pieColors = colors || defaultColors;
  
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
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PieChart;