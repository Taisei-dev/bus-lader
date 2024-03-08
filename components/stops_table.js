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
  Skeleton,
  SkeletonText,
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
          {...stopTimes.length
            ? stopTimes.map((stopTime, index) => {
                return (
                  <Tr key={index}>
                    <Td>{stopTime.stop_name}</Td>
                    <Td>
                      {stopTime.departure_time.split(':').slice(0, 2).join(':')}
                    </Td>
                  </Tr>
                );
              })
            : [
                <Tr key="skeleton">
                  <Td>
                    <SkeletonText
                      noOfLines={16}
                      spacing="3"
                      skeletonHeight="5"
                    />
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={16}
                      spacing="3"
                      skeletonHeight="5"
                    />
                  </Td>
                </Tr>,
              ]}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
