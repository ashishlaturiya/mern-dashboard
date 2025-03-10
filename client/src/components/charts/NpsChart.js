import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Flex, 
  Select, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const NpsChart = ({ data }) => {
  const [timeframe, setTimeframe] = useState('monthly');
  
  // Process data for trend view
  const processTrendData = () => {
    if (!data || !data.length) return [];
    
    // Group data by date according to selected timeframe
    const groupedData = data.reduce((acc, item) => {
      let period;
      const date = new Date(item.dateOfSale);
      let sortKey; // Add a sort key to each entry
      
      // Create the period string based on selected timeframe
      if (timeframe === 'weekly') {
        // Get week number of the year
        const weekNumber = Math.ceil((date.getDate() + (new Date(date.getFullYear(), date.getMonth(), 1).getDay())) / 7);
        period = `Week ${weekNumber}, ${date.getFullYear()}`;
        sortKey = date.getFullYear() * 100 + weekNumber; // Sortable format: YYYYWW
      } else if (timeframe === 'monthly') {
        period = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        sortKey = date.getFullYear() * 100 + date.getMonth(); // Sortable format: YYYYMM
      } else if (timeframe === 'quarterly') {
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        period = `Q${quarter} ${date.getFullYear()}`;
        sortKey = date.getFullYear() * 10 + quarter; // Sortable format: YYYYQ
      } else { // yearly
        period = `${date.getFullYear()}`;
        sortKey = date.getFullYear(); // Sortable format: YYYY
      }
      
      if (!acc[period]) {
        acc[period] = { 
          period, 
          sortKey,  // Store the sort key
          totalNps: 0, 
          count: 0, 
          detractors: 0, 
          passives: 0, 
          promoters: 0 
        };
      }
      
      // Rest of the code remains the same...
      acc[period].totalNps += item.nps;
      acc[period].count += 1;
      
      // Categorize NPS scores
      if (item.nps <= 6) {
        acc[period].detractors += 1;
      } else if (item.nps <= 8) {
        acc[period].passives += 1;
      } else {
        acc[period].promoters += 1;
      }
      
      return acc;
    }, {});
    
    // Convert to array and calculate averages as before
    const result = Object.values(groupedData).map(group => ({
      ...group,
      averageNps: group.totalNps / group.count,
      npsScore: ((group.promoters - group.detractors) / group.count) * 100
    }));
    
    // Sort by the numeric sortKey instead of string comparison
    return result.sort((a, b) => a.sortKey - b.sortKey);
  };
  
  // Process data for category view (by agent, city, etc.)
  const processCategoryData = () => {
    if (!data || !data.length) return [];
    
    // Group by sales agent (could be modified to group by other categories)
    const groupedData = data.reduce((acc, item) => {
      const category = item.salesAgent; // Change this to group by different categories
      
      if (!acc[category]) {
        acc[category] = { 
          category, 
          totalNps: 0, 
          count: 0, 
          detractors: 0, 
          passives: 0, 
          promoters: 0 
        };
      }
      
      acc[category].totalNps += item.nps;
      acc[category].count += 1;
      
      // Categorize NPS scores
      if (item.nps <= 6) {
        acc[category].detractors += 1;
      } else if (item.nps <= 8) {
        acc[category].passives += 1;
      } else {
        acc[category].promoters += 1;
      }
      
      return acc;
    }, {});
    
    // Convert to array and calculate NPS scores
    const result = Object.values(groupedData).map(group => ({
      ...group,
      averageNps: group.totalNps / group.count,
      npsScore: ((group.promoters - group.detractors) / group.count) * 100
    }));
    
    // Sort by NPS score (descending)
    return result.sort((a, b) => b.npsScore - a.npsScore);
  };
  
  const trendData = processTrendData();
  const categoryData = processCategoryData();
  
  return (
    <Box
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      p={4}
      boxShadow="md"
      w="100%"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">NPS Score Analysis</Heading>
        <Flex>
          <Select 
            size="sm" 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            width="130px"
            mr={2}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </Flex>
      </Flex>
      
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Trend Over Time</Tab>
          {/* <Tab>By Sales Agent</Tab> */}
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[-100, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(1)}`, 'NPS Score']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="npsScore"
                  name="NPS Score"
                  stroke="#38B2AC"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="averageNps"
                  name="Avg. Rating (0-10)"
                  stroke="#805AD5"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabPanel>
          <TabPanel p={0}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={categoryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis domain={[-100, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(1)}`, 'NPS Score']}
                />
                <Legend />
                <Bar
                  dataKey="npsScore"
                  name="NPS Score"
                  fill="#38B2AC"
                />
                <Bar
                  dataKey="averageNps"
                  name="Avg. Rating (0-10)"
                  fill="#805AD5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default NpsChart;