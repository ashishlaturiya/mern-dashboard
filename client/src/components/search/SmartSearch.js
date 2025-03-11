import React, { useState } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
//   Flex,
  Text,
  Spinner,
  useToast,
  Portal,
  VStack,
  Divider
} from '@chakra-ui/react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Query parser function
const parseQuery = (query) => {
  // Convert to lowercase for easier pattern matching
  const lowerQuery = query.toLowerCase();
  
  // Define patterns to match
  const patterns = [
    // Pattern for sales by city
    { 
      regex: /(?:show|display|get)\s+(?:me\s+)?(?:the\s+)?(?:sales|sale)\s+(?:data\s+)?(?:for|in|of)\s+([a-z\s]+)/i,
      action: 'sales-by-city',
      extractParam: (matches) => {
        // Clean up city name
        return matches[1].trim();
      }
    },
    // Pattern for sales by agent
    {
      regex: /(?:show|display|get)\s+(?:me\s+)?(?:the\s+)?(?:sales|sale)\s+(?:data\s+)?(?:by|for)\s+(?:agent|salesperson)\s+([a-z\s]+)/i,
      action: 'sales-by-agent',
      extractParam: (matches) => {
        return matches[1].trim();
      }
    },
    // Pattern for NPS analysis
    {
      regex: /(?:show|display|get)\s+(?:me\s+)?(?:the\s+)?(?:nps|net\s+promoter\s+score)\s+(?:data|analysis|stats|statistics)?/i,
      action: 'nps-analysis',
      extractParam: () => null
    },
    // Pattern for gender analysis
    {
      regex: /(?:show|display|get)\s+(?:me\s+)?(?:the\s+)?(?:gender|demographic)\s+(?:data|analysis|breakdown|distribution)?/i,
      action: 'gender-analysis',
      extractParam: () => null
    },
    // Pattern for feedback analysis
    {
      regex: /(?:show|display|get)\s+(?:me\s+)?(?:the\s+)?(?:feedback|customer\s+feedback)\s+(?:data|analysis)?/i,
      action: 'feedback-analysis',
      extractParam: () => null
    },
    // Pattern for property listings
    {
      regex: /(?:show|display|get)\s+(?:me\s+)?(?:the\s+)?(?:property|properties|listing|listings)(?:\s+in\s+([a-z\s]+))?/i,
      action: 'properties',
      extractParam: (matches) => {
        return matches[1] ? matches[1].trim() : null;
      }
    }
  ];
  
  // Check against patterns
  for (const pattern of patterns) {
    const matches = lowerQuery.match(pattern.regex);
    if (matches) {
      return {
        action: pattern.action,
        param: pattern.extractParam(matches)
      };
    }
  }
  
  // No match found
  return { action: 'unknown', param: null };
};

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  
  // Example queries for suggestions
  const exampleQueries = [
    "Show me sales data for Singapore Central",
    "Display sales by agent John Tan",
    "Show NPS analysis",
    "Get gender analysis",
    "Show me property listings in Woodlands"
  ];
  
  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    // Parse the query
    setTimeout(() => {
      const result = parseQuery(query);
      
      if (result.action === 'unknown') {
        toast({
          title: "I didn't understand that",
          description: "Try asking for sales data for a specific city, agent performance, or NPS analysis.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsProcessing(false);
        return;
      }
      
      // Navigate based on result
      switch (result.action) {
        case 'sales-by-city':
          navigate('/sales-by-city', { state: { filter: 'city', value: result.param } });
          break;
        case 'sales-by-agent':
          navigate('/sales-by-city', { state: { filter: 'agent', value: result.param } });
          break;
        case 'nps-analysis':
          navigate('/nps-analysis');
          break;
        case 'gender-analysis':
          navigate('/gender-analysis');
          break;
        case 'feedback-analysis':
          navigate('/feedback-analysis');
          break;
        case 'properties':
          navigate('/properties', { state: { filter: result.param ? 'city' : null, value: result.param } });
          break;
        default:
          navigate('/');
      }
      
      toast({
        title: "Generating view",
        description: `Processing query: "${query}"`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setIsProcessing(false);
      setQuery('');
    }, 1000); // Simulate processing time
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };
  
  return (
    <Box position="relative">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.300" />
        </InputLeftElement>
        
        <Input
          placeholder="Ask me anything... (e.g., 'Show sales data for Singapore Central')"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(query.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          bg="white"
          size="md"
          width={{ base: "100%", md: "400px" }}
          borderRadius="md"
        />
        
        {query && (
          <InputRightElement width="4.5rem">
            {isProcessing ? (
              <Spinner size="sm" color="teal.500" />
            ) : (
              <>
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setQuery('')}
                  variant="ghost"
                >
                  <FiX />
                </Button>
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleSearch}
                  colorScheme="teal"
                >
                  Go
                </Button>
              </>
            )}
          </InputRightElement>
        )}
      </InputGroup>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Portal>
          <Box
            position="absolute"
            top="100%"
            left="0"
            right="0"
            mt="2"
            p="2"
            bg="white"
            boxShadow="md"
            borderRadius="md"
            zIndex={10}
            maxH="300px"
            overflowY="auto"
          >
            <Text fontSize="sm" color="gray.500" mb="2">
              Example queries:
            </Text>
            <VStack align="stretch" divider={<Divider />} spacing="2">
              {exampleQueries
                .filter(example => example.toLowerCase().includes(query.toLowerCase()))
                .map((example, index) => (
                  <Text
                    key={index}
                    p="2"
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    onClick={() => handleSuggestionClick(example)}
                  >
                    {example}
                  </Text>
                ))}
            </VStack>
          </Box>
        </Portal>
      )}
    </Box>
  );
};

export default SmartSearch;