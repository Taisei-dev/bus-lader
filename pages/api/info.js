import {
  getAlert,
  getTripUpdate,
  getVehiclePosition,
} from '../../lib/gtfs-realtime';
import { DataNotFoundError } from '../../lib/notfounderror';
export default async function handler(req, res) {
  const companyId = req.query.company_id;
  try {
    if (companyId) {
      const tripUpdate = await getTripUpdate(companyId);
      const vehiclePosition = await getVehiclePosition(companyId);
      const alert = await getAlert(companyId);
      res.status(200).json({ tripUpdate, vehiclePosition, alert });
      return;
    }
    let info = {};
    Object.keys(constants).map(async (id) => {
      const tripUpdate = await getTripUpdate(id);
      const vehiclePosition = await getVehiclePosition(id);
      const alert = await getAlert(id);
      info[companyId] = { tripUpdate, vehiclePosition, alert };
    });
    res.status(200).json(info);
  } catch (e) {
    if (err instanceof DataNotFoundError) {
      return res.status(404).json({
        message: err.message,
        dataCategory: err.dataCategory,
        queryId: err.queryId,
      });
    }
    throw err;
  }
}
