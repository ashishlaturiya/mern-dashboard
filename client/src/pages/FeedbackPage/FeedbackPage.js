import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  // SimpleGrid,
  Flex,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

// Components
import FeedbackForm from '../../components/feedback/FeedbackForm';
import FeedbackList from '../../components/feedback/FeedbackList';
import FeedbackAnalysis from '../../components/feedback/FeedbackAnalysis';

// Services
import { getAllFeedback, getFeedbackAnalysis } from '../../services/feedbackService';

const FeedbackPage = () => {
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [feedbackData, analysisResult] = await Promise.all([
        getAllFeedback(),
        getFeedbackAnalysis()
      ]);
      
      setFeedbackEntries(feedbackData);
      setAnalysisData(analysisResult);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFeedbackSubmitted = (newFeedback) => {
    // Close the modal if open
    if (isOpen) onClose();
    
    // Refresh the data
    fetchData();
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%" minH="500px">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Customer Feedback</Heading>
        <Button 
          leftIcon={<FiPlus />} 
          colorScheme="teal" 
          onClick={onOpen}
        >
          Add Feedback
        </Button>
      </Flex>
      
      {/* Feedback Analysis */}
      <FeedbackAnalysis analysisData={analysisData} />
      
      {/* Feedback Management Tabs */}
      <Tabs colorScheme="teal" variant="enclosed">
        <TabList>
          <Tab>All Feedback</Tab>
          <Tab>Positive</Tab>
          <Tab>Neutral</Tab>
          <Tab>Negative</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={0} pt={4}>
            <FeedbackList feedbackEntries={feedbackEntries} />
          </TabPanel>
          <TabPanel p={0} pt={4}>
            <FeedbackList 
              feedbackEntries={feedbackEntries.filter(f => f.sentiment === 'positive')} 
            />
          </TabPanel>
          <TabPanel p={0} pt={4}>
            <FeedbackList 
              feedbackEntries={feedbackEntries.filter(f => f.sentiment === 'neutral')} 
            />
          </TabPanel>
          <TabPanel p={0} pt={4}>
            <FeedbackList 
              feedbackEntries={feedbackEntries.filter(f => f.sentiment === 'negative')} 
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Feedback Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit New Feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FeedbackPage;