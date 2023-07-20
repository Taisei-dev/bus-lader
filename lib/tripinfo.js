import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dbUrl } from './constants';

async function queryStopTimes(db, tripId) {
  const query =
    'SELECT stop_id,arrival_time,departure_time FROM stop_times WHERE trip_id=? ORDER BY stop_sequence';
  const result = await db.all(query, tripId);
  return result;
}

async function queryShapeId(db, tripId) {
  const query = 'SELECT shape_id FROM trips WHERE trip_id=? ';
  const result = await db.get(query, tripId);
  return result.shape_id;
}

async function queryShapes(db, shapeId) {
  const query =
    'SELECT shape_pt_lat,shape_pt_lon FROM shapes WHERE shape_id=? ORDER BY shape_pt_sequence';
  const result = await db.all(query, shapeId);
  return result;
}

export async function getTripInfo(companyId, tripId) {
  console.log(process.cwd());
  sqlite3.verbose();
  const db = await open({
    filename: dbUrl(companyId),
    driver: sqlite3.Database,
  });
  const stopTimes = await queryStopTimes(db, tripId);
  const shapeId = await queryShapeId(db, tripId);
  const shapes = await queryShapes(db, shapeId);
  return { stopTimes, shapes };
}
