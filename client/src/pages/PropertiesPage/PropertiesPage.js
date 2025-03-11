import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
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
  Badge,
  InputGroup,
  Input,
  InputLeftElement,
  Select,
  Card,
  CardBody,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

// API
import { getProperties } from '../../services/api';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [filterAlert, setFilterAlert] = useState(null);
  
  // Get location state from router
  const location = useLocation();
  const filterFromQuery = location.state?.filter;
  const valueFromQuery = location.state?.value;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const propertiesData = await getProperties();
        
        setProperties(propertiesData);
        
        // Handle any query parameters from the smart search
        if (filterFromQuery === 'city' && valueFromQuery) {
          // Extract unique cities
          const cities = [...new Set(propertiesData.map(p => p.location.city))];
          
          // Find closest match for city
          const cityMatch = findClosestMatch(valueFromQuery, cities);
          
          if (cityMatch) {
            setCityFilter(cityMatch);
            setFilterAlert({
              type: 'info',
              title: 'Filtered by City',
              description: `Showing properties in ${cityMatch}`,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
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
    return 'all';
  };
  
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%" minH="500px">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }
  
  // Get unique property types and cities for filters
  const propertyTypes = ['all', ...new Set(properties.map(p => p.propertyType))];
  const cities = ['all', ...new Set(properties.map(p => p.location.city))];
  
  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.propertyId.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    
    const matchesType = typeFilter === 'all' || property.propertyType === typeFilter;
    
    const matchesCity = cityFilter === 'all' || property.location.city === cityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesCity;
  });
  
  // Summary statistics
  const availableCount = filteredProperties.filter(p => p.status === 'Available').length;
  const soldCount = filteredProperties.filter(p => p.status === 'Sold').length;
  const reservedCount = filteredProperties.filter(p => p.status === 'Reserved').length;
  
  // Price calculations
  const avgPrice = filteredProperties.length 
    ? filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length 
    : 0;
    
  const minPrice = filteredProperties.length 
    ? Math.min(...filteredProperties.map(p => p.price)) 
    : 0;
    
  const maxPrice = filteredProperties.length 
    ? Math.max(...filteredProperties.map(p => p.price)) 
    : 0;
  
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
            onClick={() => {
              setFilterAlert(null);
              setCityFilter('all');
            }} 
          />
        </Alert>
      )}
    
      <Heading size="lg" mb={6}>Property Listings</Heading>
      
      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={8}>
        <Card>
          <CardBody>
            <Stack spacing={3}>
              <Heading size="md" color="teal.500">Properties</Heading>
              <Flex justify="space-between">
                <Text fontWeight="medium">Total:</Text>
                <Text>{filteredProperties.length}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium">Available:</Text>
                <Text color="green.500">{availableCount}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium">Sold:</Text>
                <Text color="red.500">{soldCount}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium">Reserved:</Text>
                <Text color="orange.500">{reservedCount}</Text>
              </Flex>
            </Stack>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stack spacing={3}>
              <Heading size="md" color="teal.500">Pricing</Heading>
              <Flex justify="space-between">
                <Text fontWeight="medium">Average:</Text>
                <Text>
                  {new Intl.NumberFormat('en-SG', { 
                    style: 'currency', 
                    currency: 'SGD',
                    maximumFractionDigits: 0 
                  }).format(avgPrice)}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium">Minimum:</Text>
                <Text>
                  {new Intl.NumberFormat('en-SG', { 
                    style: 'currency', 
                    currency: 'SGD',
                    maximumFractionDigits: 0 
                  }).format(minPrice)}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium">Maximum:</Text>
                <Text>
                  {new Intl.NumberFormat('en-SG', { 
                    style: 'currency', 
                    currency: 'SGD',
                    maximumFractionDigits: 0 
                  }).format(maxPrice)}
                </Text>
              </Flex>
            </Stack>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stack spacing={3}>
              <Heading size="md" color="teal.500">Type Distribution</Heading>
              {propertyTypes.filter(t => t !== 'all').map((type) => {
                const count = filteredProperties.filter(p => p.propertyType === type).length;
                const percentage = filteredProperties.length 
                  ? (count / filteredProperties.length * 100).toFixed(1)
                  : 0;
                return (
                  <Flex key={type} justify="space-between">
                    <Text fontWeight="medium">{type}:</Text>
                    <Text>{count} ({percentage}%)</Text>
                  </Flex>
                );
              })}
            </Stack>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stack spacing={3}>
              <Heading size="md" color="teal.500">Features</Heading>
              {properties.length > 0 && 
                getTopFeatures(properties).map((feature) => (
                  <Flex key={feature.name} justify="space-between">
                    <Text fontWeight="medium">{feature.name}:</Text>
                    <Text>{feature.count} properties</Text>
                  </Flex>
                ))}
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Filter Row */}
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        mb={6} 
        gap={4}
        bg="white" 
        p={5} 
        borderRadius="lg" 
        boxShadow="md"
      >
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        <Select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          width={{ base: '100%', md: '200px' }}
        >
          <option value="all">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Reserved">Reserved</option>
        </Select>
        
        <Select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          width={{ base: '100%', md: '200px' }}
        >
          <option value="all">All Types</option>
          {propertyTypes.filter(t => t !== 'all').map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
        
        <Select 
          value={cityFilter} 
          onChange={(e) => setCityFilter(e.target.value)}
          width={{ base: '100%', md: '200px' }}
        >
          <option value="all">All Cities</option>
          {cities.filter(c => c !== 'all').map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </Select>
      </Flex>
      
      {/* Properties Table */}
      <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
        <Text mb={4}>Showing {filteredProperties.length} of {properties.length} properties</Text>
        
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Property ID</Th>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Location</Th>
                <Th isNumeric>Price</Th>
                <Th isNumeric>Area (sqft)</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProperties.length === 0 ? (
                <Tr>
                  <Td colSpan={7} textAlign="center">No properties matching your search</Td>
                </Tr>
              ) : (
                filteredProperties.map((property, idx) => (
                  <Tr key={idx}>
                    <Td>{property.propertyId}</Td>
                    <Td fontWeight="medium">{property.propertyName}</Td>
                    <Td>{property.propertyType}</Td>
                    <Td>{property.location.city}, {property.location.district}</Td>
                    <Td isNumeric>
                      {new Intl.NumberFormat('en-SG', { 
                        style: 'currency', 
                        currency: 'SGD',
                        maximumFractionDigits: 0 
                      }).format(property.price)}
                    </Td>
                    <Td isNumeric>{property.area}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          property.status === 'Available' ? 'green' :
                          property.status === 'Reserved' ? 'orange' : 
                          'red'
                        }
                      >
                        {property.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

// Helper function to get the top features across all properties
function getTopFeatures(properties) {
  // Count feature occurrences
  const featureCounts = {};
  properties.forEach(property => {
    if (property.features && Array.isArray(property.features)) {
      property.features.forEach(feature => {
        featureCounts[feature] = (featureCounts[feature] || 0) + 1;
      });
    }
  });
  
  // Convert to array and sort
  return Object.entries(featureCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 features
}

export default PropertiesPage;