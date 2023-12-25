import { DataNotFoundError } from '../../lib/notfounderror';
import { getTripInfo } from '../../lib/querytripinfo';

export default async function handler(req, res) {
  const tripId = req.query.trip_id;
  if (!tripId) {
    return res.status(400).json({ message: 'trip_id required' });
  }
  try {
    const tripInfo = await getTripInfo(tripId);
    return res.status(200).json(tripInfo);
  } catch (err) {
    if (err instanceof DataNotFoundError) {
      return res
        .status(404)
        .json({
          message: err.message,
          dataCategory: err.dataCategory,
          queryId: err.queryId,
        });
    }
    throw err;
  }
}
