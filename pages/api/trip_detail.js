import { DataNotFoundError } from '../../lib/notfounderror';
import prisma from '../../lib/prisma';

async function fetchTripInfo(tripId, companyId) {
  const stopTimes = await prisma.stopTime.findMany({
    where: {
      trip_id: tripId,
      company_id: companyId,
    },
    select: {
      stop_name: true,
      stop_headsign: true,
      stop_lat: true,
      stop_lon: true,
      departure_time: true,
    },
    orderBy: {
      stop_sequence: 'asc',
    },
  });
  if (!stopTimes.length) {
    throw new DataNotFoundError('stoptimes', tripId);
  }
  const trip = await prisma.trip.findUnique({
    where: {
      compound_trip_id: {
        trip_id: tripId,
        company_id: companyId,
      },
    },
    select: {
      route_id: true,
      shape_id: true,
    },
  });
  const routeId = trip['route_id'],
    shapeId = trip['shape_id'];
  const routeNames = await prisma.route.findUnique({
    where: {
      compound_route_id: {
        route_id: routeId,
        company_id: companyId,
      },
    },
    select: {
      short_name: true,
      long_name: true,
    },
  });
  if (!shapeId) {
    //shapes can be empty
    return { routeNames, stopTimes, shapes: [] };
  }
  const shapes = await prisma.shapePoint.findMany({
    where: {
      shape_id: shapeId,
      company_id: companyId,
    },
    select: {
      shape_pt_lat: true,
      shape_pt_lon: true,
    },
    orderBy: {
      shape_pt_sequence: 'asc',
    },
  });
  return { routeNames, stopTimes, shapes };
}

export default async function handler(req, res) {
  const tripId = req.query.trip_id;
  const companyId = req.query.company_id;
  if (!tripId) {
    return res.status(400).json({ message: 'trip_id required' });
  }
  if (!companyId) {
    return res.status(400).json({ message: 'company_id required' });
  }

  try {
    const tripInfo = await fetchTripInfo(tripId, companyId);
    return res.status(200).json(tripInfo);
  } catch (err) {
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
