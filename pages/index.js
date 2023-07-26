import { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import Map from '../components/map';
import StopsTable from '../components/stops_table';
export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure(true);
  const [tripId, setTripId] = useState('');
  const [stopTimes, setStopTimes] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Map
        setStopTimes={(stopTimes) => {
          onOpen();
          setStopTimes(stopTimes);
        }}
        setTripId={setTripId}
        colorMode={colorMode}
      />
      <Drawer
        variant="alwaysOpen"
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
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
          <DrawerCloseButton />
          <DrawerHeader>運行情報</DrawerHeader>
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
              くるけんで開く
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
