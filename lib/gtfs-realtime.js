import { FeedMessage } from './gtfs-realtime_pb';
import constants from './constants.json';

export async function getTripUpdate(companyId) {
  const data = await fetch(constants[companyId].realtimeUrl.tripUpdate)
    .then((res) => res.arrayBuffer())
    .then((data) => FeedMessage.deserializeBinary(data).toObject());
  return data.entityList;
}

export async function getVehiclePosition(companyId) {
  const data = await fetch(constants[companyId].realtimeUrl.vehiclePosition)
    .then((res) => res.arrayBuffer())
    .then((data) => FeedMessage.deserializeBinary(data).toObject());
  return data.entityList;
}

export async function getAlert(companyId) {
  const data = await fetch(constants[companyId].realtimeUrl.alert)
    .then((res) => res.arrayBuffer())
    .then((data) => FeedMessage.deserializeBinary(data).toObject());
  return data.entityList;
}
