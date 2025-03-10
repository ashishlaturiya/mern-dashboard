import React from 'react';
import { Box, VStack, Text, Flex, Icon, Link } from '@chakra-ui/react';
import { NavLink as RouterLink } from 'react-router-dom';
import {
  FiHome,
  FiBarChart2,
  FiMapPin,
  FiUsers,
  FiMessageSquare,
  FiGrid,
  FiDollarSign,
  FiMessageCircle
} from 'react-icons/fi';

const NavItem = ({ icon, children, to, ...rest }) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      {({ isActive }) => (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? 'teal.400' : 'transparent'}
          color={isActive ? 'white' : 'gray.600'}
          _hover={{
            bg: 'teal.400',
            color: 'white',
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              as={icon}
            />
          )}
          {children}
        </Flex>
      )}
    </Link>
  );
};

const Sidebar = () => {
  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="full"
      w="64"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      boxShadow="sm"
      zIndex="10"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="teal.500">
          FAYREDGE
        </Text>
      </Flex>
      <VStack spacing={1} align="stretch">
        <NavItem icon={FiHome} to="/">
          Dashboard
        </NavItem>
        <NavItem icon={FiBarChart2} to="/nps-analysis">
          NPS Analysis
        </NavItem>
        <NavItem icon={FiMapPin} to="/sales-by-city">
          Sales by City
        </NavItem>
        <NavItem icon={FiUsers} to="/gender-analysis">
          Gender Analysis
        </NavItem>
        <NavItem icon={FiMessageSquare} to="/feedback-analysis">
          Feedback Analysis
        </NavItem>
        <NavItem icon={FiMessageCircle} to="/feedback">
          Customer Feedback
        </NavItem>
        <NavItem icon={FiGrid} to="/properties">
          Properties
        </NavItem>
        <NavItem icon={FiDollarSign} to="/sales">
          Sales
        </NavItem>
      </VStack>
    </Box>
  );
};

export default Sidebar;