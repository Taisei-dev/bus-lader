export function geojsonVehicledata(data) {
  return {
    type: 'FeatureCollection',
    features: data.map((val) => {
      return {
        type: 'Feature',
        properties: {
          company_id: val.company_id,
          trip_id: val.vehicle.trip.tripId,
          bearing: val.vehicle.position.bearing,
        },
        geometry: {
          type: 'Point',
          coordinates: [
            val.vehicle.position.longitude,
            val.vehicle.position.latitude,
          ],
        },
      };
    }),
  };
}

export function geojsonStopdata(data) {
  return {
    type: 'FeatureCollection',
    features: data.map((val) => {
      return {
        type: 'Feature',
        properties: {
          stop_name: val.stop_name,
        },
        geometry: {
          type: 'Point',
          coordinates: [val.stop_lon, val.stop_lat],
        },
      };
    }),
  };
}

export function geojsonShapedata(data) {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: data.map((val) => {
        return [val.shape_pt_lon, val.shape_pt_lat];
      }),
    },
  };
}
