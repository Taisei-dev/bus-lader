import constants from '../../lib/constants.json';
import { getVehiclePosition } from '../../lib/gtfs-realtime';

export default async function handler(req, res) {
  try {
    const vehiclePosition = (
      await Promise.all(
        Object.keys(constants).map((id) =>
          getVehiclePosition(id).then((array) =>
            array.map((entity) => {
              return {
                company_id: id,
                ...entity,
              };
            })
          )
        )
      )
    ).flat();
    res.status(200).json(vehiclePosition);
  } catch (err) {
    res.status(500);
  }
}
