import { FeedMessage } from './gtfs-realtime_pb';
import { tripUpdateUrl, vehiclePositionUrl, alertUrl } from './constants';

export async function getTripUpdate(companyId) {
  const data = await fetch(tripUpdateUrl(companyId))
    .then((res) => res.arrayBuffer())
    .then((data) => FeedMessage.deserializeBinary(data).toObject());
  return data.entityList;
}

export async function getVehiclePosition(companyId) {
  const data = await fetch(vehiclePositionUrl(companyId))
    .then((res) => res.arrayBuffer())
    .then((data) => FeedMessage.deserializeBinary(data).toObject());
  return data.entityList;
}

export async function getAlert(companyId) {
  const data = await fetch(alertUrl(companyId))
    .then((res) => res.arrayBuffer())
    .then((data) => FeedMessage.deserializeBinary(data).toObject());
  return data.entityList;
}
