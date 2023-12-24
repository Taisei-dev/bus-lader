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
} from '@chakra-ui/react';
import StopsTable from './stops_table';
export default function RightTripInfoDrawer({
  isOpen,
  onClose,
  stopTimes,
  tripId,
}) {
  return (
    <Drawer
      variant="alwaysOpen"
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
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
        <DrawerHeader>運行情報</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          <StopsTable stopTimes={stopTimes} />
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            閉じる
          </Button>
          <Button
            colorScheme="blue"
            as="a"
            target="_blank"
            href={`https://kuruken-alpha.vercel.app/trip?daiyasid=${tripId}`}
          >
            詳細を見る
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
