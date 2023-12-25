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
import { DataNotFoundError } from '../lib/notfounderror';

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
          title: '位置データの取得に失敗しました',
          description: '10秒後にもう一度取得します',
          duration: 9000,
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
      .then((res) => {
        if (!res.ok) {
          if (res.status == 404) {
            throw new DataNotFoundError();
          } else {
            throw new Error();
          }
        }
        return res.json();
      })
      .then((data) => {
        setShapeStopData({
          shapes: geojsonShapedata(data.shapes),
          stops: geojsonStopdata(data.stopTimes),
        });
        setStopTimes(data.stopTimes);
      })
      .catch((err) => {
        onClose();
        toast({
          position: 'bottom-right',
          status: 'error',
          title: '便データの取得に失敗しました',
          description:
            err instanceof DataNotFoundError ? 'データがありません' : '',
          duration: 9000,
          isClosable: true,
        });
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
