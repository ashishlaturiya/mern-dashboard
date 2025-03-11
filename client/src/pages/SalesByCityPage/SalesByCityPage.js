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
  Card,
  CardBody,
  Text,
  Stack,
  Select,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// API
import { getSalesByCity, getPropertiesByCity, getSales, getSalesByAgent } from '../../services/api';

const SalesByCityPage = () => {
  const [salesByCity, setSalesByCity] = useState([]);
  const [propertiesByCity, setPropertiesByCity] = useState([]);
  const [sales, setSales] = useState([]);
  const [salesByAgent, setSalesByAgent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('salesCount');
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [viewMode, setViewMode] = useState('city'); // 'city' or 'agent'
  const [filterAlert, setFilterAlert] = useState(null);
  
  // Get location state from router
  const location = useLocation();
  const filterFromQuery = location.state?.filter;
  const valueFromQuery = location.state?.value;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let cityData, propertyData, salesData, agentData;
        
        // Fetch all data in parallel for performance
        [cityData, propertyData, salesData, agentData] = await Promise.all([
          getSalesByCity(),
          getPropertiesByCity(),
          getSales(),
          getSalesByAgent()
        ]);
        
        setSalesByCity(cityData);
        setPropertiesByCity(propertyData);
        setSales(salesData);
        setSalesByAgent(agentData);
        
        // Handle any query parameters from the smart search
        if (filterFromQuery === 'city' && valueFromQuery) {
          // Find closest match for city
          const cityMatch = findClosestMatch(
            valueFromQuery, 
            cityData.map(c => c._id)
          );
          
          if (cityMatch) {
            setSelectedCity(cityMatch);
            setViewMode('city');
            setFilterAlert({
              type: 'info',
              title: 'Filtered by City',
              description: `Showing sales data for ${cityMatch}`,
            });
          }
        } else if (filterFromQuery === 'agent' && valueFromQuery) {
          // Find closest match for agent
          const agentMatch = findClosestMatch(
            valueFromQuery,
            agentData.map(a => a._id)
          );
          
          if (agentMatch) {
            setSelectedAgent(agentMatch);
            setViewMode('agent');
            setFilterAlert({
              type: 'info',
              title: 'Filtered by Agent',
              description: `Showing sales data for agent ${agentMatch}`,
            });
          }
        } else {
          // Default selected city to the one with the most sales
          if (cityData.length > 0) {
            const sortedCities = [...cityData].sort((a, b) => b.count - a.count);
            setSelectedCity(sortedCities[0]._id);
          }
          
          // Default selected agent to the one with the most sales
          if (agentData.length > 0) {
            const sortedAgents = [...agentData].sort((a, b) => b.count - a.count);
            setSelectedAgent(sortedAgents[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [filterFromQuery, valueFromQuery]);
  
  // Helper function to find closest match in a list of strings
  const findClosestMatch = (query, options) => {
    if (!options || options.length === 0) return null;
    
    const queryLower = query.toLowerCase();
    
    // First try to find exact match
    const exactMatch = options.find(opt => 
      opt.toLowerCase() === queryLower
    );
    
    if (exactMatch) return exactMatch;
    
    // Then try to find substring match
    const substringMatch = options.find(opt => 
      opt.toLowerCase().includes(queryLower) || 
      queryLower.includes(opt.toLowerCase())
    );
    
    if (substringMatch) return substringMatch;
    
    // Default to first option if no match
    return options[0];
  };
  
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%" minH="500px">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }
  
  // Sort the city data based on the selected sort option
  const sortedCities = [...salesByCity].sort((a, b) => {
    if (sortBy === 'salesCount') return b.count - a.count;
    if (sortBy === 'totalValue') return b.totalValue - a.totalValue;
    if (sortBy === 'avgPrice') return (b.totalValue / b.count) - (a.totalValue / a.count);
    return 0;
  });
  
  // Sort the agent data by sales count
  const sortedAgents = [...salesByAgent].sort((a, b) => b.count - a.count);
  
  // Format the city data for charts
  const cityBarChartData = sortedCities.map(city => ({
    city: city._id,
    sales: city.count,
    value: (city.totalValue / 1000000).toFixed(2) // Convert to millions
  }));
  
  // Format the agent data for charts
  const agentBarChartData = sortedAgents.map(agent => ({
    agent: agent._id,
    sales: agent.count,
    value: (agent.totalValue / 1000000).toFixed(2) // Convert to millions
  }));
  
  // Prepare pie chart data for sales distribution by city
  const salesDistributionData = sortedCities.map((city, index) => ({
    name: city._id,
    value: city.count,
    color: getColorForIndex(index)
  }));
  
  // Prepare pie chart data for sales distribution by agent
  const agentDistributionData = sortedAgents.map((agent, index) => ({
    name: agent._id,
    value: agent.count,
    color: getColorForIndex(index)
  }));
  
  function getColorForIndex(index) {
    const colors = ['#38B2AC', '#4299E1', '#805AD5', '#DD6B20', '#F6E05E', '#FC8181'];
    return colors[index % colors.length];
  }
  
  // Get sales data for the selected city or agent
  const filteredSales = viewMode === 'city'
    ? sales.filter(sale => sale.location.city === selectedCity)
            .sort((a, b) => new Date(b.dateOfSale) - new Date(a.dateOfSale))
    : sales.filter(sale => sale.salesAgent === selectedAgent)
            .sort((a, b) => new Date(b.dateOfSale) - new Date(a.dateOfSale));
  
  return (
    <Box>
      {filterAlert && (
        <Alert status={filterAlert.type} mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>{filterAlert.title}</AlertTitle>
          <AlertDescription>{filterAlert.description}</AlertDescription>
          <CloseButton 
            position="absolute" 
            right="8px" 
            top="8px" 
            onClick={() => setFilterAlert(null)} 
          />
        </Alert>
      )}
    
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">{viewMode === 'city' ? 'Sales by City' : 'Sales by Agent'}</Heading>
        <Flex>
          <Select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)}
            width="150px"
            mr={3}
          >
            <option value="city">View by City</option>
            <option value="agent">View by Agent</option>
          </Select>
          
          <Select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            width="200px"
            mr={3}
          >
            <option value="salesCount">Sort by Sales Count</option>
            <option value="totalValue">Sort by Total Value</option>
            <option value="avgPrice">Sort by Average Price</option>
          </Select>
          
          {viewMode === 'city' ? (
            <Select 
              value={selectedCity || ''} 
              onChange={(e) => setSelectedCity(e.target.value)}
              width="200px"
            >
              {sortedCities.map(city => (
                <option key={city._id} value={city._id}>
                  {city._id}
                </option>
              ))}
            </Select>
          ) : (
            <Select 
              value={selectedAgent || ''} 
              onChange={(e) => setSelectedAgent(e.target.value)}
              width="200px"
            >
              {sortedAgents.map(agent => (
                <option key={agent._id} value={agent._id}>
                  {agent._id}
                </option>
              ))}
            </Select>
          )}
        </Flex>
      </Flex>
      
      {/* Performance Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
        {viewMode === 'city' ? (
          // City performance cards
          sortedCities.slice(0, 3).map((city, index) => {
            const avgPrice = city.totalValue / city.count;
            const cityProperties = propertiesByCity.find(p => p._id === city._id);
            const propertyCount = cityProperties ? cityProperties.count : 0;
            
            return (
              <Card key={index}>
                <CardBody>
                  <Stack spacing={3}>
                    <Flex justify="space-between" align="center">
                      <Heading size="md" color={`teal.${600 - index * 100}`}>{city._id}</Heading>
                      <Badge colorScheme={index === 0 ? 'green' : index === 1 ? 'blue' : 'purple'}>
                        #{index + 1}
                      </Badge>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Total Sales:</Text>
                      <Text>{city.count}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Total Value:</Text>
                      <Text>
                        {new Intl.NumberFormat('en-SG', { 
                          style: 'currency', 
                          currency: 'SGD',
                          maximumFractionDigits: 0 
                        }).format(city.totalValue)}
                      </Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Average Price:</Text>
                      <Text>
                        {new Intl.NumberFormat('en-SG', { 
                          style: 'currency', 
                          currency: 'SGD',
                          maximumFractionDigits: 0 
                        }).format(avgPrice)}
                      </Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Properties:</Text>
                      <Text>{propertyCount}</Text>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
            );
          })
        ) : (
          // Agent performance cards
          sortedAgents.slice(0, 3).map((agent, index) => {
            const avgPrice = agent.totalValue / agent.count;
            
            return (
              <Card key={index}>
                <CardBody>
                  <Stack spacing={3}>
                    <Flex justify="space-between" align="center">
                      <Heading size="md" color={`teal.${600 - index * 100}`}>{agent._id}</Heading>
                      <Badge colorScheme={index === 0 ? 'green' : index === 1 ? 'blue' : 'purple'}>
                        #{index + 1}
                      </Badge>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Total Sales:</Text>
                      <Text>{agent.count}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Total Value:</Text>
                      <Text>
                        {new Intl.NumberFormat('en-SG', { 
                          style: 'currency', 
                          currency: 'SGD',
                          maximumFractionDigits: 0 
                        }).format(agent.totalValue)}
                      </Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Average Price:</Text>
                      <Text>
                        {new Intl.NumberFormat('en-SG', { 
                          style: 'currency', 
                          currency: 'SGD',
                          maximumFractionDigits: 0 
                        }).format(avgPrice)}
                      </Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Avg. NPS:</Text>
                      <Text>{agent.avgNps ? agent.avgNps.toFixed(1) : 'N/A'}</Text>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
            );
          })
        )}
      </SimpleGrid>
      
      {/* Charts Row */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>
            {viewMode === 'city' ? 'Sales by City Comparison' : 'Sales by Agent Comparison'}
          </Heading>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={viewMode === 'city' ? cityBarChartData : agentBarChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={viewMode === 'city' ? 'city' : 'agent'} 
                angle={-45} 
                textAnchor="end" 
                height={70} 
              />
              <YAxis yAxisId="left" orientation="left" stroke="#38B2AC" />
              <YAxis yAxisId="right" orientation="right" stroke="#4299E1" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" name="Number of Sales" fill="#38B2AC" />
              <Bar yAxisId="right" dataKey="value" name="Sales Value (Millions)" fill="#4299E1" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        
        <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>
            {viewMode === 'city' ? 'Sales Distribution by City' : 'Sales Distribution by Agent'}
          </Heading>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={viewMode === 'city' ? salesDistributionData : agentDistributionData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {(viewMode === 'city' ? salesDistributionData : agentDistributionData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} sales`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>
      
      {/* Recent Sales Table */}
      <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4}>
          {viewMode === 'city' 
            ? `Recent Sales in ${selectedCity}` 
            : `Recent Sales by ${selectedAgent}`}
        </Heading>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Property</Th>
                <Th>Date of Sale</Th>
                <Th isNumeric>Price</Th>
                {viewMode === 'city' && <Th>Sales Agent</Th>}
                {viewMode === 'agent' && <Th>Location</Th>}
                <Th>NPS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredSales.slice(0, 10).map((sale, idx) => (
                <Tr key={idx}>
                  <Td fontWeight="medium">{sale.propertyName}</Td>
                  <Td>{new Date(sale.dateOfSale).toLocaleDateString()}</Td>
                  <Td isNumeric>
                    {new Intl.NumberFormat('en-SG', { 
                      style: 'currency', 
                      currency: 'SGD',
                      maximumFractionDigits: 0 
                    }).format(sale.price)}
                  </Td>
                  {viewMode === 'city' && <Td>{sale.salesAgent}</Td>}
                  {viewMode === 'agent' && <Td>{sale.location.city}</Td>}
                  <Td>
                    <Badge colorScheme={sale.nps >= 9 ? 'green' : sale.nps >= 7 ? 'yellow' : 'red'}>
                      {sale.nps}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SalesByCityPage;