import {
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Icon,
  Text,
  Stack,
  Skeleton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaLocationArrow } from 'react-icons/fa6';
import StopsTable from './stops_table';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import constants from '../lib/constants.json';
export default function BottomTripInfoDrawer({
  isOpen,
  onClose,
  routeName,
  stopTimes,
  tripId,
  companyId,
}) {
  const [index, setIndex] = useState([0]);
  function minimize() {
    setIndex([]);
  }
  useEffect(() => {
    setIndex([0]);
  }, [tripId]);
  return (
    <Drawer
      variant="alwaysOpen"
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      trapFocus={false}
      closeOnOverlayClick={false}
      blockScrollOnMount={false}
    >
      <DrawerContent
        style={{
          background: useColorModeValue(
            'rgba(255,255,255,0.6)',
            'rgba(0,0,0,0.5)'
          ),
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <Accordion index={index} allowMultiple onChange={setIndex}>
          <AccordionItem>
            {({ isExpanded }) => (
              <>
                <DrawerHeader p={0}>
                  <h2>
                    <AccordionButton py={3}>
                      運行情報
                      {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
                    </AccordionButton>
                  </h2>
                </DrawerHeader>
                <DrawerCloseButton />

                <AccordionPanel p={0}>
                  <DrawerBody maxH="50vh">
                    <Stack direction={['column', 'row']} mb={4}>
                      <Text>
                        {companyId ? (
                          <>
                            <Icon
                              as={FaLocationArrow}
                              color={constants[companyId].color}
                            />
                            {constants[companyId].name}
                          </>
                        ) : (
                          <Skeleton>Company Name</Skeleton>
                        )}
                      </Text>
                      <Text>
                        {routeName ? (
                          routeName
                        ) : (
                          <Skeleton>Route Name</Skeleton>
                        )}
                      </Text>
                    </Stack>
                    <StopsTable stopTimes={stopTimes} />
                  </DrawerBody>
                  <DrawerFooter>
                    <Button variant="outline" mr={3} onClick={minimize}>
                      最小化
                    </Button>
                    <Button variant="outline" mr={3} onClick={onClose}>
                      閉じる
                    </Button>
                    {/* <Button
                      colorScheme="blue"
                      as="a"
                      target="_blank"
                      href={`https://kuruken-alpha.vercel.app/trip?daiyasid=${tripId}`}
                    >
                      詳細を見る
                    </Button> */}
                  </DrawerFooter>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </DrawerContent>
    </Drawer>
  );
}
