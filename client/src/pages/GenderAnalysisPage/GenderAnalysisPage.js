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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select
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
import { getSales } from '../../services/api';

const GenderAnalysisPage = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ageFilter, setAgeFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const salesData = await getSales();
        setSales(salesData);
      } catch (error) {
        console.error('Error fetching gender data:', error);
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
  
  // Filter sales based on age group
  const filteredSales = sales.filter(sale => {
    if (ageFilter === 'all') return true;
    return sale.customer.ageGroup === ageFilter;
  });
  
  // Calculate gender distribution for filtered sales
  const genderDistribution = filteredSales.reduce((acc, sale) => {
    const gender = sale.customer.gender;
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});
  
  // Total sales count
  const totalFilteredSales = filteredSales.length;
  
  // Format the gender distribution for PieChart
  const genderPieData = Object.entries(genderDistribution).map(([gender, count]) => ({
    name: gender,
    value: count,
    percentage: ((count / totalFilteredSales) * 100).toFixed(1)
  }));
  
  // Calculate property type preferences by gender
  const propertyPreferences = filteredSales.reduce((acc, sale) => {
    const gender = sale.customer.gender;
    const propertyName = sale.propertyName;
    const propertyType = propertyName.split(' ')[1]; // Extracting property type from name
    
    if (!acc[gender]) {
      acc[gender] = {};
    }
    
    acc[gender][propertyType] = (acc[gender][propertyType] || 0) + 1;
    
    return acc;
  }, {});
  
  // Format property preferences for BarChart
  const propertyTypesByGender = [];
  
  for (const [gender, preferences] of Object.entries(propertyPreferences)) {
    for (const [propertyType, count] of Object.entries(preferences)) {
      propertyTypesByGender.push({
        gender,
        propertyType,
        count
      });
    }
  }
  
  // Age group distribution
  const ageGroupDistribution = filteredSales.reduce((acc, sale) => {
    const ageGroup = sale.customer.ageGroup;
    const gender = sale.customer.gender;
    
    if (!acc[ageGroup]) {
      acc[ageGroup] = { Male: 0, Female: 0 };
    }
    
    acc[ageGroup][gender] = (acc[ageGroup][gender] || 0) + 1;
    
    return acc;
  }, {});
  
  // Format age group distribution for BarChart
  const ageGroupData = Object.entries(ageGroupDistribution).map(([ageGroup, genders]) => ({
    ageGroup,
    Male: genders.Male || 0,
    Female: genders.Female || 0
  })).sort((a, b) => {
    // Sort age groups in ascending order
    const getMinAge = (ageGroup) => parseInt(ageGroup.split('-')[0]) || 0;
    return getMinAge(a.ageGroup) - getMinAge(b.ageGroup);
  });
  
  // Calculate average prices by gender
  const pricesByGender = filteredSales.reduce((acc, sale) => {
    const gender = sale.customer.gender;
    
    if (!acc[gender]) {
      acc[gender] = { total: 0, count: 0 };
    }
    
    acc[gender].total += sale.price;
    acc[gender].count += 1;
    
    return acc;
  }, {});
  
  // Format average prices for display
  const averagePricesByGender = Object.entries(pricesByGender).map(([gender, data]) => ({
    gender,
    averagePrice: data.total / data.count,
    count: data.count
  }));
  
  // Calculate NPS by gender
  const npsByGender = filteredSales.reduce((acc, sale) => {
    const gender = sale.customer.gender;
    
    if (!acc[gender]) {
      acc[gender] = { total: 0, count: 0 };
    }
    
    acc[gender].total += sale.nps;
    acc[gender].count += 1;
    
    return acc;
  }, {});
  
  // Format NPS for display
  const averageNpsByGender = Object.entries(npsByGender).map(([gender, data]) => ({
    gender,
    averageNps: data.total / data.count,
    count: data.count
  }));
  
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Customer Demographics Analysis</Heading>
        <Select 
          value={ageFilter} 
          onChange={(e) => setAgeFilter(e.target.value)}
          width="200px"
        >
          <option value="all">All Age Groups</option>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-45">36-45</option>
          <option value="46-55">46-55</option>
          <option value="56+">56+</option>
        </Select>
      </Flex>
      
      {/* Gender Distribution Summary */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Gender Distribution</Heading>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={genderPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#4299E1" /> {/* Blue for Male */}
                  <Cell fill="#F687B3" /> {/* Pink for Female */}
                </Pie>
                <Tooltip formatter={(value) => [`${value} customers (${genderPieData.find(item => item.value === value)?.percentage}%)`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Average Purchase by Gender</StatLabel>
              {averagePricesByGender.map((item, idx) => (
                <Box key={idx} mt={3}>
                  <StatNumber fontSize="xl" color={item.gender === 'Male' ? 'blue.500' : 'pink.500'}>
                    {new Intl.NumberFormat('en-SG', { 
                      style: 'currency', 
                      currency: 'SGD',
                      maximumFractionDigits: 0 
                    }).format(item.averagePrice)}
                  </StatNumber>
                  <StatHelpText>
                    {item.gender} ({item.count} sales)
                  </StatHelpText>
                </Box>
              ))}
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Average NPS by Gender</StatLabel>
              {averageNpsByGender.map((item, idx) => (
                <Box key={idx} mt={3}>
                  <StatNumber fontSize="xl" color={item.gender === 'Male' ? 'blue.500' : 'pink.500'}>
                    {item.averageNps.toFixed(1)}
                  </StatNumber>
                  <StatHelpText>
                    {item.gender} ({item.count} responses)
                  </StatHelpText>
                </Box>
              ))}
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Age Group Distribution */}
      <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={8}>
        <Heading size="md" mb={4}>Age Group Distribution by Gender</Heading>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={ageGroupData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ageGroup" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Male" name="Male Customers" fill="#4299E1" />
            <Bar dataKey="Female" name="Female Customers" fill="#F687B3" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Property Preferences Table */}
      <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4}>Property Type Preferences by Gender</Heading>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Gender</Th>
                <Th>Property Type</Th>
                <Th isNumeric>Count</Th>
                <Th isNumeric>Percentage</Th>
              </Tr>
            </Thead>
            <Tbody>
              {propertyTypesByGender.map((item, idx) => {
                const genderTotal = genderDistribution[item.gender] || 0;
                const percentage = genderTotal > 0 ? (item.count / genderTotal) * 100 : 0;
                
                return (
                  <Tr key={idx}>
                    <Td color={item.gender === 'Male' ? 'blue.500' : 'pink.500'} fontWeight="bold">
                      {item.gender}
                    </Td>
                    <Td>{item.propertyType}</Td>
                    <Td isNumeric>{item.count}</Td>
                    <Td isNumeric>{percentage.toFixed(1)}%</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default GenderAnalysisPage;