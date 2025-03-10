import React from 'react';
import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Heading,
  SimpleGrid,
  Divider,
  Tag
} from '@chakra-ui/react';

const FeedbackList = ({ feedbackEntries }) => {
  if (!feedbackEntries || feedbackEntries.length === 0) {
    return (
      <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
        <Text>No feedback has been submitted yet.</Text>
      </Box>
    );
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'green';
      case 'negative':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'property':
        return 'blue';
      case 'service':
        return 'orange';
      case 'pricing':
        return 'purple';
      case 'agent':
        return 'teal';
      case 'website':
        return 'cyan';
      default:
        return 'gray';
    }
  };

  return (
    <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={4}>Recent Feedback</Heading>
      
      <VStack spacing={4} align="stretch">
        {feedbackEntries.map((feedback, index) => (
          <Box 
            key={feedback._id || index} 
            p={4} 
            borderWidth="1px" 
            borderRadius="md"
            borderLeftWidth="4px"
            borderLeftColor={`${getSentimentColor(feedback.sentiment)}.500`}
          >
            <Text mb={3}>{feedback.text}</Text>
            
            <SimpleGrid columns={2} spacing={2}>
              <Flex align="center">
                <Badge colorScheme={getSentimentColor(feedback.sentiment)} mr={2}>
                  {feedback.sentiment}
                </Badge>
                <Tag size="sm" colorScheme={getCategoryColor(feedback.category)}>
                  {feedback.category}
                </Tag>
              </Flex>
              
              <Text textAlign="right" fontSize="sm" color="gray.500">
                {new Date(feedback.createdAt).toLocaleString()}
              </Text>
            </SimpleGrid>
            
            {index < feedbackEntries.length - 1 && <Divider mt={3} />}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default FeedbackList;