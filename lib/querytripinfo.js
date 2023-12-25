import { sql } from '@vercel/postgres';
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

export async function getTripInfo(tripId) {
  const stopTimes = await queryStopTimes(tripId);
  const shapeId = await queryShapeId(tripId);
  const shapes = await queryShapes(shapeId);
  return { stopTimes, shapes };
}
