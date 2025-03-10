import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  Spinner,
  Stack,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
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
  ResponsiveContainer 
} from 'recharts';

// Components
import NpsChart from '../../components/charts/NpsChart';

// API
import { getSales, getSalesByAgent } from '../../services/api';

const NpsAnalysisPage = () => {
  const [sales, setSales] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [salesData, agentsData] = await Promise.all([
          getSales(),
          getSalesByAgent()
        ]);
        
        setSales(salesData);
        setAgents(agentsData);
      } catch (error) {
        console.error('Error fetching NPS data:', error);
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
  
  // Filter sales based on time period
  const filteredSales = sales.filter(sale => {
    if (timeFilter === 'all') return true;
    
    const saleDate = new Date(sale.dateOfSale);
    const now = new Date();
    
    if (timeFilter === 'last30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return saleDate >= thirtyDaysAgo;
    }
    
    if (timeFilter === 'last90') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(now.getDate() - 90);
      return saleDate >= ninetyDaysAgo;
    }
    
    if (timeFilter === 'last180') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setDate(now.getDate() - 180);
      return saleDate >= sixMonthsAgo;
    }
    
    return true;
  });
  
  // Calculate filtered NPS scores
  const filteredNpsData = {
    detractors: filteredSales.filter(sale => sale.nps <= 6).length,
    passives: filteredSales.filter(sale => sale.nps > 6 && sale.nps < 9).length,
    promoters: filteredSales.filter(sale => sale.nps >= 9).length
  };
  
  filteredNpsData.total = filteredNpsData.detractors + filteredNpsData.passives + filteredNpsData.promoters;
  filteredNpsData.score = filteredNpsData.total ? 
    ((filteredNpsData.promoters - filteredNpsData.detractors) / filteredNpsData.total) * 100 : 0;
  
  // Prepare pie chart data
  const npsDistributionData = [
    { name: 'Promoters (9-10)', value: filteredNpsData.promoters, color: '#38A169' },
    { name: 'Passives (7-8)', value: filteredNpsData.passives, color: '#ECC94B' },
    { name: 'Detractors (0-6)', value: filteredNpsData.detractors, color: '#E53E3E' }
  ];
  
  // Prepare NPS score breakdown
  const npsScoreBreakdown = Array(11).fill(0).map((_, idx) => ({
    score: idx,
    count: filteredSales.filter(sale => sale.nps === idx).length
  }));
  
  // Prepare agent NPS scores
  const agentNpsScores = agents.map(agent => ({
    name: agent._id,
    score: agent.avgNps,
    sales: agent.count,
    color: getScoreColor(agent.avgNps)
  })).sort((a, b) => b.score - a.score);
  
  function getScoreColor(score) {
    if (score >= 9) return '#38A169'; // green
    if (score >= 7) return '#ECC94B'; // yellow
    return '#E53E3E'; // red
  }
  
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">NPS Analysis</Heading>
        <Select 
          value={timeFilter} 
          onChange={(e) => setTimeFilter(e.target.value)}
          width="200px"
        >
          <option value="all">All Time</option>
          <option value="last30">Last 30 Days</option>
          <option value="last90">Last 90 Days</option>
          <option value="last180">Last 180 Days</option>
        </Select>
      </Flex>
      
      {/* NPS Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>NPS Score</StatLabel>
              <StatNumber fontSize="3xl" color={filteredNpsData.score > 50 ? 'green.500' : filteredNpsData.score > 0 ? 'yellow.500' : 'red.500'}>
                {filteredNpsData.score.toFixed(1)}
              </StatNumber>
              <StatHelpText>
                {filteredNpsData.total} responses
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stack spacing={3}>
              <Text fontWeight="bold">Customer Sentiment</Text>
              <Flex justify="space-between">
                <Text>Promoters ({filteredNpsData.promoters})</Text>
                <Text>{((filteredNpsData.promoters / filteredNpsData.total) * 100).toFixed(1)}%</Text>
              </Flex>
              <Progress value={(filteredNpsData.promoters / filteredNpsData.total) * 100} colorScheme="green" borderRadius="md" />
              
              <Flex justify="space-between">
                <Text>Passives ({filteredNpsData.passives})</Text>
                <Text>{((filteredNpsData.passives / filteredNpsData.total) * 100).toFixed(1)}%</Text>
              </Flex>
              <Progress value={(filteredNpsData.passives / filteredNpsData.total) * 100} colorScheme="yellow" borderRadius="md" />
              
              <Flex justify="space-between">
                <Text>Detractors ({filteredNpsData.detractors})</Text>
                <Text>{((filteredNpsData.detractors / filteredNpsData.total) * 100).toFixed(1)}%</Text>
              </Flex>
              <Progress value={(filteredNpsData.detractors / filteredNpsData.total) * 100} colorScheme="red" borderRadius="md" />
            </Stack>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Text fontWeight="bold" mb={2}>NPS Distribution</Text>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={npsDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {npsDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* New NPS Chart */}
      <Box mb={8}>
        <NpsChart data={filteredSales} />
      </Box>
      
      {/* NPS Score Breakdown */}
      <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={8}>
        <Heading size="md" mb={4}>NPS Score Breakdown</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={npsScoreBreakdown}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="score" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="count" 
              name="Number of Responses" 
              fill={(entry) => {
                const score = entry.score;
                if (score >= 9) return '#38A169';
                if (score >= 7) return '#ECC94B';
                return '#E53E3E';
              }}
            >
              {npsScoreBreakdown.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.score >= 9 ? '#38A169' : entry.score >= 7 ? '#ECC94B' : '#E53E3E'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Agent Performance */}
      <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4}>Agent NPS Performance</Heading>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Agent Name</Th>
                <Th isNumeric>NPS Score (Avg)</Th>
                <Th isNumeric>Sales Count</Th>
                <Th>Performance</Th>
              </Tr>
            </Thead>
            <Tbody>
              {agentNpsScores.map((agent, idx) => (
                <Tr key={idx}>
                  <Td fontWeight="medium">{agent.name}</Td>
                  <Td isNumeric fontWeight="bold" color={agent.color}>
                    {agent.score.toFixed(1)}
                  </Td>
                  <Td isNumeric>{agent.sales}</Td>
                  <Td>
                    <Badge colorScheme={agent.score >= 9 ? 'green' : agent.score >= 7 ? 'yellow' : 'red'}>
                      {agent.score >= 9 ? 'Excellent' : agent.score >= 7 ? 'Good' : 'Needs Improvement'}
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

export default NpsAnalysisPage;