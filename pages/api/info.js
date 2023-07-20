import {
  getAlert,
  getTripUpdate,
  getVehiclePosition,
} from '../../lib/realtime';
export default async function handler(req, res) {
  const tripUpdate = await getTripUpdate();
  const vehiclePosition = await getVehiclePosition();
  const alert = await getAlert();
  res.status(200).json([tripUpdate, vehiclePosition, alert]);
}
