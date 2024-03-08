import { sql } from '@vercel/postgres';
import prisma from './prisma';
import { DataNotFoundError } from './notfounderror';

async function queryStopTimes(tripId) {
  const { rows } =
    await sql`SELECT stop_id,stop_name,stop_lat,stop_lon,arrival_time,departure_time FROM stop_times WHERE trip_id=${tripId} ORDER BY stop_sequence`;
  if (!rows.length) {
    throw new DataNotFoundError('stoptimes', tripId);
  }
  return rows;
}

async function queryShapeId(tripId) {
  const { rows } =
    await sql`SELECT shape_id FROM trips WHERE trip_id=${tripId}`;
  if (!rows.length) {
    throw new DataNotFoundError('shapeId', tripId);
  }
  return rows[0].shape_id;
}

async function queryShapes(shapeId) {
  const { rows } =
    await sql`SELECT shape_pt_lat,shape_pt_lon FROM shapes WHERE shape_id=${shapeId} ORDER BY shape_pt_sequence`;
  if (!rows.length) {
    throw new DataNotFoundError('shapes', shapeId);
  }
  return rows;
}

export async function /*getTripInfo(tripId) {
  const stopTimes = await queryStopTimes(tripId);
  try {
    const shapeId = await queryShapeId(tripId);
    const shapes = await queryShapes(shapeId);
    return { stopTimes, shapes };
  } catch (err) {
    if (err instanceof DataNotFoundError) {
      // shapes can be empty
      return { stopTimes, shapes: [] };
    }
  }
}

async function*/ getTripInfo(tripId, companyId) {
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
  const shapeId = (
    await prisma.trip.findUnique({
      where: {
        compound_trip_id: {
          trip_id: tripId,
          company_id: companyId,
        },
      },
      select: {
        shape_id: true,
      },
    })
  )['shape_id'];
  console.log(shapeId);
  if (!shapeId) {
    return { stopTimes, shapes: [] };
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
  return { stopTimes, shapes };
}
