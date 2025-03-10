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
  Badge
} from '@chakra-ui/react';
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
import { getSalesByCity, getPropertiesByCity, getSales } from '../../services/api';

const SalesByCityPage = () => {
  const [salesByCity, setSalesByCity] = useState([]);
  const [propertiesByCity, setPropertiesByCity] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('salesCount');
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [salesByCityData, propertiesByCityData, salesData] = await Promise.all([
          getSalesByCity(),
          getPropertiesByCity(),
          getSales()
        ]);
        
        setSalesByCity(salesByCityData);
        setPropertiesByCity(propertiesByCityData);
        setSales(salesData);
        
        // Default selected city to the one with the most sales
        if (salesByCityData.length > 0) {
          const sortedCities = [...salesByCityData].sort((a, b) => b.count - a.count);
          setSelectedCity(sortedCities[0]._id);
        }
      } catch (error) {
        console.error('Error fetching city data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
  
  // Format the city data for charts
  const cityBarChartData = sortedCities.map(city => ({
    city: city._id,
    sales: city.count,
    value: (city.totalValue / 1000000).toFixed(2) // Convert to millions
  }));
  
  // Prepare pie chart data for sales distribution by city
  const salesDistributionData = sortedCities.map((city, index) => ({
    name: city._id,
    value: city.count,
    color: getColorForIndex(index)
  }));
  
  function getColorForIndex(index) {
    const colors = ['#38B2AC', '#4299E1', '#805AD5', '#DD6B20', '#F6E05E', '#FC8181'];
    return colors[index % colors.length];
  }
  
  // Get sales data for the selected city
  const selectedCitySales = sales.filter(sale => 
    sale.location.city === selectedCity
  ).sort((a, b) => new Date(b.dateOfSale) - new Date(a.dateOfSale));
  
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Sales by City</Heading>
        <Flex>
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
        </Flex>
      </Flex>
      
      {/* City Performance Summary */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
        {sortedCities.slice(0, 3).map((city, index) => {
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
        })}
      </SimpleGrid>
      
      {/* Charts Row */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>Sales by City Comparison</Heading>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={cityBarChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" angle={-45} textAnchor="end" height={70} />
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
          <Heading size="md" mb={4}>Sales Distribution by City</Heading>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={salesDistributionData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {salesDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} sales`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>
      
      {/* Recent Sales in Selected City */}
      <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4}>Recent Sales in {selectedCity}</Heading>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Property</Th>
                <Th>Date of Sale</Th>
                <Th isNumeric>Price</Th>
                <Th>Sales Agent</Th>
                <Th>NPS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {selectedCitySales.slice(0, 10).map((sale, idx) => (
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
                  <Td>{sale.salesAgent}</Td>
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