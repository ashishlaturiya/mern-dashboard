import React from 'react';
import { Box, Stat, StatLabel, StatNumber, StatArrow, StatHelpText, Flex, Icon, useColorModeValue } from '@chakra-ui/react';

const StatCard = ({ title, value, helpText, icon, change, colorScheme = 'teal', format }) => {
  const formatValue = (val) => {
    if (!format) return val;
    
    switch(format) {
      case 'currency':
        return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(val);
      case 'number':
        return new Intl.NumberFormat().format(val);
      case 'percent':
        return `${val}%`;
      default:
        return val;
    }
  };
  
  return (
    <Box
      p={5}
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      boxShadow="md"
      w="100%"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Stat>
          <StatLabel fontSize="md" color="gray.500">{title}</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold" color={`${colorScheme}.500`}>
            {formatValue(value)}
          </StatNumber>
          {helpText && (
            <StatHelpText>
              {change && (
                <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
              )}
              {helpText}
            </StatHelpText>
          )}
        </Stat>
        {icon && (
          <Box p={2} bg={`${colorScheme}.100`} borderRadius="md">
            <Icon as={icon} w={6} h={6} color={`${colorScheme}.500`} />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default StatCard;