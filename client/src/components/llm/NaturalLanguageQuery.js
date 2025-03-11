// client/src/components/llm/NaturalLanguageQuery.js
import React, { useState } from 'react';
import {
  Box, 
  InputGroup, 
  Input, 
  InputRightElement, 
  Button, 
  Text,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import DataTable from './DataTable';
import DataChart from './DataChart';
import { executeNaturalLanguageQuery } from '../../services/api';

const NaturalLanguageQuery = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the API function instead of axios directly
      const data = await executeNaturalLanguageQuery(query);
      setResults(data);
    } catch (err) {
      console.error('Error executing query:', err);
      setError('Failed to process your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mb={6}>
      <form onSubmit={handleSubmit}>
        <InputGroup size="md" mb={4}>
          <Input
            placeholder="Ask a question about your data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="sm"
            _focus={{
              borderColor: "teal.400",
              boxShadow: "0 0 0 1px #38B2AC",
            }}
            height="42px"
            fontSize="md"
          />
          <InputRightElement width="4.5rem" h="42px">
            <Button
              h="1.75rem"
              size="sm"
              colorScheme="teal"
              type="submit"
              isLoading={loading}
              rightIcon={<FiSearch />}
              position="absolute"
              right="8px"
              top="8px"
            >
              {loading ? '' : 'Search'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
      
      {loading && (
        <Flex justify="center" align="center" direction="column" my={8}>
          <Spinner color="teal.500" size="lg" />
          <Text mt={2} color="gray.600">Processing your query...</Text>
        </Flex>
      )}
      
      {error && (
        <Alert status="error" borderRadius="md" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      
      {results && !loading && (
        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" mt={4}>
          <Text fontWeight="medium" mb={3} color="gray.700">Results for: "{query}"</Text>
          
          <Tabs variant="enclosed" onChange={setActiveTab} index={activeTab} colorScheme="teal">
            <TabList>
              <Tab _selected={{ color: 'teal.500', borderColor: 'teal.500', borderBottomColor: 'white' }}>Table View</Tab>
              <Tab _selected={{ color: 'teal.500', borderColor: 'teal.500', borderBottomColor: 'white' }}>Chart View</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={3}>
                <DataTable data={results} />
              </TabPanel>
              <TabPanel p={3}>
                <DataChart data={results} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </Box>
  );
};

export default NaturalLanguageQuery;