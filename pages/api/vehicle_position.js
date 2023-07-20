import { companyIds } from '../../lib/constants';
import { getVehiclePosition } from '../../lib/realtime';

export default async function handler(req, res) {
  const vehiclePosition = (
    await Promise.all(
      companyIds.map((id) =>
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
}
