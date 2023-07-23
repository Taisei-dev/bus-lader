import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';

export default function StopsTable({ stopTimes }) {
  return (
    <TableContainer>
      <Table size="xs">
        <Thead>
          <Tr>
            <Th>停留所</Th>
            <Th>定刻</Th>
          </Tr>
        </Thead>
        <Tbody>
          {...stopTimes.map((stopTime) => {
            return (
              <Tr key={stopTime.stop_id}>
                <Td>{stopTime.stop_name}</Td>
                <Td>
                  {stopTime.departure_time.split(':').slice(0, 2).join(':')}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
