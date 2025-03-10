import React from 'react';
import { 
  Flex, 
  Heading, 
  IconButton, 
  Avatar, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  Input,
  InputRightElement
} from '@chakra-ui/react';
import { 
  FiBell, 
  FiSearch,
  FiSettings,
  FiUser,
  FiLogOut
} from 'react-icons/fi';

const Header = () => {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      py={4}
      px={8}
      bg="white"
      borderBottomWidth="1px"
      boxShadow="sm"
    >
      <Heading size="md" color="teal.600">Fayredge Dashboard</Heading>
      
      <Flex align="center">
        <InputGroup maxW="300px" mx={4}>
          <Input placeholder="Search..." />
          <InputRightElement>
            <FiSearch color="gray.300" />
          </InputRightElement>
        </InputGroup>
        
        <IconButton
          aria-label="Notifications"
          icon={<FiBell />}
          variant="ghost"
          colorScheme="teal"
          fontSize="20px"
          mr={2}
        />
        
        <Menu>
          <MenuButton>
            <Avatar size="sm" name="User" bg="teal.500" />
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiUser />}>Profile</MenuItem>
            <MenuItem icon={<FiSettings />}>Settings</MenuItem>
            <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;