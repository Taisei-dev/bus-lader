import { getTripInfo } from '../../lib/tripinfo';

export default async function handler(req, res) {
  const companyId = req.query.company_id;
  if (!companyId) {
    return res.status(400).json({ message: 'company_id required' });
  }
  const tripId = req.query.trip_id;
  if (!tripId) {
    return res.status(400).json({ message: 'trip_id required' });
  }
  const tripInfo = await getTripInfo(companyId, tripId);
  return res.status(200).json(tripInfo);
}
