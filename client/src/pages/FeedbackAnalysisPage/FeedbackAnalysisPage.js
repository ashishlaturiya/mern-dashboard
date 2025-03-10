import React from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  Tag,
  Text,
  Progress,
  // Flex
} from '@chakra-ui/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const FeedbackAnalysis = ({ analysisData }) => {
  if (!analysisData) {
    return (
      <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={8}>
        <Text>No analysis data available yet.</Text>
      </Box>
    );
  }

  const { sentimentCounts, categoryCounts, keywordAnalysis } = analysisData;

  // Prepare data for sentiment pie chart
  const sentimentData = sentimentCounts.map(item => ({
    name: item._id,
    value: item.count
  }));

  // Prepare data for category bar chart
  const categoryData = categoryCounts.map(item => ({
    name: item._id,
    count: item.count
  }));

  // Colors for sentiment
  const SENTIMENT_COLORS = {
    positive: '#38A169',
    neutral: '#718096',
    negative: '#E53E3E'
  };

  // Total feedback count
  const totalFeedback = sentimentData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={8}>
      <Heading size="md" mb={4}>Feedback Analysis</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={6}>
        {/* Sentiment Distribution */}
        <Box>
          <Heading size="sm" mb={4}>Sentiment Distribution</Heading>
          <Box height="200px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={SENTIMENT_COLORS[entry.name] || '#718096'} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} feedbacks`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        
        {/* Feedback by Category */}
        <Box>
          <Heading size="sm" mb={4}>Feedback by Category</Heading>
          <Box height="200px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                  width={70}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#38B2AC" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </SimpleGrid>
      
      {/* Common Keywords */}
      {keywordAnalysis && keywordAnalysis.length > 0 && (
        <Box mb={6}>
          <Heading size="sm" mb={3}>Common Keywords</Heading>
          <HStack spacing={2} flexWrap="wrap">
            {keywordAnalysis.map((item, index) => (
              <Tag 
                key={index} 
                size="md" 
                variant="subtle" 
                colorScheme="teal"
                fontSize={`${Math.min(16 + item.count/2, 22)}px`}
                m={1}
              >
                {item.word} ({item.count})
              </Tag>
            ))}
          </HStack>
        </Box>
      )}
      
      {/* Sentiment Summary */}
      <Box>
        <Heading size="sm" mb={3}>Sentiment Summary</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {sentimentData.map((item) => {
            const percentage = totalFeedback > 0 
              ? (item.value / totalFeedback) * 100 
              : 0;
              
            const colorScheme = 
              item.name === 'positive' ? 'green' : 
              item.name === 'negative' ? 'red' : 'gray';
              
            return (
              <Stat key={item.name}>
                <StatLabel>{item.name} Feedback</StatLabel>
                <StatNumber>{item.value}</StatNumber>
                <StatHelpText>{percentage.toFixed(1)}%</StatHelpText>
                <Progress 
                  value={percentage} 
                  colorScheme={colorScheme} 
                  size="sm" 
                  borderRadius="md"
                />
              </Stat>
            );
          })}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default FeedbackAnalysis;