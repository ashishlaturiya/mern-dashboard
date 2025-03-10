import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Heading,
  useToast,
  VStack,
  HStack,
  Text,
  Badge
} from '@chakra-ui/react';
import { submitFeedback } from '../../services/feedbackService';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [category, setCategory] = useState('general');
  const [sentiment, setSentiment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Perform simple sentiment analysis on text input for visual feedback
  const detectSentiment = (text) => {
    const positiveWords = ['great', 'excellent', 'good', 'satisfied', 'happy', 'thanks', 'awesome', 'love'];
    const negativeWords = ['bad', 'poor', 'terrible', 'unhappy', 'disappointed', 'issue', 'problem', 'fail'];
    
    text = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setFeedbackText(text);
    
    // Only update sentiment if there's enough text to analyze
    if (text.length > 5) {
      setSentiment(detectSentiment(text));
    } else {
      setSentiment('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      toast({
        title: 'Input required',
        description: 'Please enter your feedback before submitting.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const feedback = {
        text: feedbackText,
        category,
        sentiment: sentiment || undefined, // Let the backend calculate if empty
      };
      
      const result = await submitFeedback(feedback);
      
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setFeedbackText('');
      setCategory('general');
      setSentiment('');
      
      // Notify parent component
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(result);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error submitting your feedback. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error submitting feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Display sentiment badge based on current analysis
  const renderSentimentBadge = () => {
    if (!sentiment || feedbackText.length <= 5) return null;
    
    const colorScheme = 
      sentiment === 'positive' ? 'green' : 
      sentiment === 'negative' ? 'red' : 'gray';
    
    return (
      <Badge colorScheme={colorScheme} ml={2}>
        {sentiment}
      </Badge>
    );
  };

  return (
    <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={8}>
      <Heading size="md" mb={4}>Share Your Feedback</Heading>
      
      <VStack as="form" onSubmit={handleSubmit} spacing={4} align="flex-start">
        <FormControl isRequired>
          <FormLabel>
            Feedback
            {renderSentimentBadge()}
          </FormLabel>
          <Textarea
            placeholder="Tell us what you think about our services..."
            value={feedbackText}
            onChange={handleTextChange}
            rows={4}
          />
          {sentiment && (
            <Text fontSize="sm" color="gray.500" mt={2}>
              We detected your feedback as {sentiment}. If this doesn't seem right, don't worry - our team will review it.
            </Text>
          )}
        </FormControl>
        
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="service">Customer Service</option>
            <option value="property">Property Quality</option>
            <option value="pricing">Pricing</option>
            <option value="agent">Sales Agent</option>
            <option value="website">Website/App</option>
            <option value="other">Other</option>
          </Select>
        </FormControl>
        
        <HStack spacing={4} width="100%" justifyContent="flex-end">
          <Button 
            type="button" 
            onClick={() => {
              setFeedbackText('');
              setCategory('general');
              setSentiment('');
            }}
            variant="outline"
          >
            Clear
          </Button>
          <Button 
            type="submit" 
            colorScheme="teal" 
            isLoading={isLoading}
          >
            Submit Feedback
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default FeedbackForm;