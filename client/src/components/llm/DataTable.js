// client/src/components/llm/DataTable.js
import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text
} from '@chakra-ui/react';

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <Text>No data to display</Text>;
  }
  
  const columns = Object.keys(data[0]);
  
  return (
    <TableContainer>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            {columns.map(column => (
              <Th key={column} color="teal.600">{column}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex} _hover={{ bg: 'gray.50' }}>
              {columns.map(column => (
                <Td key={`${rowIndex}-${column}`}>
                  {row[column] !== null && row[column] !== undefined ? row[column].toString() : ''}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;