import { useEffect, useState } from 'react';
import { Show, Hide, useDisclosure, useToast } from '@chakra-ui/react';
import Map from '../components/map';
import ColorModePrefMenu from '../components/colormode_selecter';
import RightTripInfoDrawer from '../components/rightdrawer';
import BottomTripInfoDrawer from '../components/bottomdrawer';
import {
  geojsonShapedata,
  geojsonStopdata,
  geojsonVehicledata,
} from '../lib/geojson';

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure(true);
  const [tripId, setTripId] = useState('');
  const [stopTimes, setStopTimes] = useState([]);
  const [vehicleData, setVehicleData] = useState(geojsonVehicledata([]));
  const [shapeStopData, setShapeStopData] = useState({
    shapes: geojsonShapedata([]),
    stops: geojsonStopdata([]),
  });
  const toast = useToast();

  function updateMap() {
    fetch('api/vehicle_position')
      .then((res) => res.json())
      .then((data) => {
        setVehicleData(geojsonVehicledata(data));
      })
      .catch(() => {
        toast({
          position: 'bottom-right',
          status: 'error',
          description: '位置データの取得に失敗しました',
          duration: 10000,
          isClosable: true,
        });
      })
      .finally(() => {
        setTimeout(updateMap, 10000);
      });
  }

  function onClick(tripId) {
    setTripId(tripId);
    setShapeStopData({
      shapes: geojsonShapedata([]),
      stops: geojsonStopdata([]),
    });
    setStopTimes([]);
    onOpen();
    fetch(`/api/trip_detail?trip_id=${tripId}`)
      .then((res) => res.json())
      .then((data) => {
        setShapeStopData({
          shapes: geojsonShapedata(data.shapes),
          stops: geojsonStopdata(data.stopTimes),
        });
        setStopTimes(data.stopTimes);
      })
      .catch(() => {
        toast({
          position: 'bottom-right',
          status: 'error',
          description: '便データの取得に失敗しました',
          duration: 10000,
          isClosable: true,
        });
        onClose();
      });
  }

  useEffect(() => {
    updateMap();
  }, []);

  return (
    <>
      <Map
        clickHandler={onClick}
        vehicleData={vehicleData}
        shapeStopData={shapeStopData}
      />
      <ColorModePrefMenu />
      <Show above="md">
        <RightTripInfoDrawer
          isOpen={isOpen}
          onClose={onClose}
          stopTimes={stopTimes}
          tripId={tripId}
        />
      </Show>
      <Hide above="md">
        <BottomTripInfoDrawer
          isOpen={isOpen}
          onClose={onClose}
          stopTimes={stopTimes}
          tripId={tripId}
        />
      </Hide>
    </>
  );
}
