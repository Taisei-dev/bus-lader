import { useEffect, useState } from 'react';
import { Show, Hide, useDisclosure, useToast } from '@chakra-ui/react';
import Map from '../components/map';
import ColorModePrefMenu from '../components/colormode_selecter';
import GuideButton from '../components/guidebutton';
import RightTripInfoDrawer from '../components/rightdrawer';
import BottomTripInfoDrawer from '../components/bottomdrawer';
import { DataNotFoundError } from '../lib/notfounderror';

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure(true);
  const [tripId, setTripId] = useState('');
  const [stopTimes, setStopTimes] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [shapeStopData, setShapeStopData] = useState({
    shapes: [],
    stops: [],
  });
  const toast = useToast();

  function updateMap() {
    fetch('api/vehicle_position')
      .then((res) => res.json())
      .then((data) => {
        setVehicleData(data);
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

  function onClick(tripId, companyId) {
    setTripId(tripId);
    setShapeStopData({
      shapes: [],
      stops: [],
    });
    setStopTimes([]);
    onOpen();
    fetch(`/api/trip_detail?trip_id=${tripId}&company_id=${companyId}`)
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
        setStopTimes(data.stopTimes);
        setShapeStopData({
          shapes: data.shapes,
          stops: data.stopTimes,
        });
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
      <GuideButton />
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
