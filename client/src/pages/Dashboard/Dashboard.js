import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Flex, 
  Spinner, 
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge
} from '@chakra-ui/react';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiHome, 
  FiBarChart2 
} from 'react-icons/fi';

// Components
// import StatCard from '../../components/charts/s';
import StatCard from '../../components/charts/StatCard';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';

// API
import { 
  getSalesSummary, 
  getNpsSummary, 
  getRecentSales, 
  getTopAgents, 
  getInventoryStatus, 
  getSalesTrends,
  getSalesByCity 
} from '../../services/api';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [salesSummary, setSalesSummary] = useState(null);
  const [npsSummary, setNpsSummary] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState([]);
  const [salesTrends, setSalesTrends] = useState([]);
  const [salesByCity, setSalesByCity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [
          salesSummaryData,
          npsSummaryData,
          recentSalesData,
          topAgentsData,
          inventoryStatusData,
          salesTrendsData,
          salesByCityData
        ] = await Promise.all([
          getSalesSummary(),
          getNpsSummary(),
          getRecentSales(),
          getTopAgents(),
          getInventoryStatus(),
          getSalesTrends(),
          getSalesByCity()
        ]);

        setSalesSummary(salesSummaryData);
        setNpsSummary(npsSummaryData);
        setRecentSales(recentSalesData);
        setTopAgents(topAgentsData);
        setInventoryStatus(inventoryStatusData);
        setSalesTrends(salesTrendsData);
        setSalesByCity(salesByCityData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%" minH="500px">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  // Format inventory data for PieChart
  const inventoryChartData = inventoryStatus.map(item => ({
    name: item._id,
    value: item.count
  }));

  // Format sales by city data for BarChart
  const salesByCityChartData = salesByCity.slice(0, 6).map(item => ({
    city: item._id,
    sales: item.count,
    value: item.totalValue / 1000000 // Convert to millions
  }));

  // Format sales trends data for LineChart
  const salesTrendsChartData = salesTrends.map(item => ({
    period: item.period,
    sales: item.count,
    value: item.totalValue / 1000000 // Convert to millions
  }));

  // Format NPS data for PieChart
  const npsChartData = npsSummary ? [
    { name: 'Promoters', value: npsSummary.promoters },
    { name: 'Passives', value: npsSummary.passives },
    { name: 'Detractors', value: npsSummary.detractors }
  ] : [];
  
  return (
    <Box>
      <Heading size="lg" mb={6}>Dashboard Overview</Heading>
      
      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <StatCard 
          title="Total Sales" 
          value={salesSummary?.totalValue || 0} 
          helpText={`${salesSummary?.totalSales || 0} transactions`} 
          icon={FiDollarSign} 
          format="currency" 
        />
        <StatCard 
          title="Average Price" 
          value={salesSummary?.averagePrice || 0} 
          helpText="Per property" 
          icon={FiTrendingUp} 
          format="currency" 
        />
        <StatCard 
          title="Available Properties" 
          value={inventoryStatus.find(item => item._id === 'Available')?.count || 0} 
          helpText="Ready for sale" 
          icon={FiHome} 
        />
        <StatCard 
          title="NPS Score" 
          value={npsSummary?.npsScore?.toFixed(1) || 0} 
          helpText={`${npsSummary?.totalResponses || 0} responses`} 
          icon={FiBarChart2} 
          colorScheme={npsSummary?.npsScore > 50 ? 'green' : npsSummary?.npsScore > 0 ? 'yellow' : 'red'} 
        />
      </SimpleGrid>
      
      {/* Charts Row 1 */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        <LineChart 
          data={salesTrendsChartData} 
          xDataKey="period" 
          lines={[
            { dataKey: 'sales', name: 'Number of Sales' },
            { dataKey: 'value', name: 'Sales Value (Millions)' }
          ]} 
          title="Sales Trends" 
        />
        <BarChart 
          data={salesByCityChartData} 
          xDataKey="city" 
          bars={[
            { dataKey: 'sales', name: 'Number of Sales' },
            { dataKey: 'value', name: 'Sales Value (Millions)' }
          ]} 
          title="Sales by City" 
        />
      </SimpleGrid>
      
      {/* Charts Row 2 */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        <PieChart 
          data={inventoryChartData} 
          nameKey="name" 
          dataKey="value" 
          title="Property Inventory Status" 
          colors={['#38B2AC', '#F6AD55', '#FC8181']} 
        />
        <PieChart 
          data={npsChartData} 
          nameKey="name" 
          dataKey="value" 
          title="NPS Distribution" 
          colors={['#38A169', '#ECC94B', '#E53E3E']} 
        />
      </SimpleGrid>
      
      {/* Tables Row */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>Top Performing Agents</Heading>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Agent</Th>
                  <Th isNumeric>Sales</Th>
                  <Th isNumeric>Total Value</Th>
                  <Th isNumeric>Avg. NPS</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topAgents.map((agent, idx) => (
                  <Tr key={idx}>
                    <Td fontWeight="medium">{agent._id}</Td>
                    <Td isNumeric>{agent.totalSales}</Td>
                    <Td isNumeric>
                      {new Intl.NumberFormat('en-SG', { 
                        style: 'currency', 
                        currency: 'SGD',
                        maximumFractionDigits: 0 
                      }).format(agent.totalValue)}
                    </Td>
                    <Td isNumeric>{agent.averageNps.toFixed(1)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        
        <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>Recent Sales</Heading>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Property</Th>
                  <Th>Location</Th>
                  <Th isNumeric>Price</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {recentSales.slice(0, 5).map((sale, idx) => (
                  <Tr key={idx}>
                    <Td fontWeight="medium">{sale.propertyName}</Td>
                    <Td>{sale.location.city}</Td>
                    <Td isNumeric>
                      {new Intl.NumberFormat('en-SG', { 
                        style: 'currency', 
                        currency: 'SGD',
                        maximumFractionDigits: 0 
                      }).format(sale.price)}
                    </Td>
                    <Td>
                      <Badge colorScheme="green">Sold</Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;