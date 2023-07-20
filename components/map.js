'use client';
import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './map.module.css';
import { busColors, lineColor, lineWidth } from '../lib/constants';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

function initMap(mapContainer, map) {
  const mapConfig = JSON.parse(localStorage.getItem('mapconfig'));

  map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [mapConfig.lng || 132.4587, mapConfig.lat || 34.4049],
    zoom: mapConfig.zoom || 12,
  });
  map.current.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: false },
      trackUserLocation: true,
      showUserLocation: true,
    }),
    'bottom-right'
  );
  map.current.addControl(
    new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric',
    }),
    'bottom-left'
  );
  map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
}

function updateMap(map) {
  fetch('api/vehicle_position')
    .then((res) => res.json())
    .then((data) => {
      map.current.getSource('vehicle_positions').setData(geojsondata(data));
    });
}

function displayPosition(map) {
  fetch('api/vehicle_position')
    .then((res) => res.json())
    .then((data) => {
      map.current.on('load', function () {
        map.current.loadImage('/busicon.png', function (err, image) {
          if (err) {
            console.log(err);
            return;
          }
          map.current.addImage('mapicon', image, { sdf: true });
          map.current.addSource('vehicle_positions', {
            type: 'geojson',
            data: geojsondata(data),
          });
          map.current.addLayer({
            id: 'vehicles',
            type: 'symbol',
            source: 'vehicle_positions',
            layout: {
              'icon-image': 'mapicon',
              'icon-size': 0.3,
              'icon-anchor': 'top',
              'icon-allow-overlap': true,
              'icon-rotate': ['get', 'bearing'],
            },
            paint: {
              'icon-color': [
                'get',
                ['concat', 'bus', ['get', 'company_id']],
                ['literal', busColors],
              ],
            },
          });
          map.current.on('click', 'vehicles', (e) => {
            fetch(
              `/api/trip_detail?company_id=${e.features[0].properties.company_id}&trip_id=${e.features[0].properties.trip_id}`
            )
              .then((res) => res.json())
              .then((data) => {
                if (!map.current.isSourceLoaded('shape')) {
                  map.current.addSource('shape', {
                    type: 'geojson',
                    data: {
                      type: 'Feature',
                      geometry: {
                        type: 'LineString',
                        coordinates: [],
                      },
                    },
                  });
                  map.current.addLayer({
                    id: 'shape',
                    type: 'line',
                    source: 'shape',
                    layout: {
                      'line-join': 'round',
                      'line-cap': 'round',
                    },
                    paint: {
                      'line-color': lineColor,
                      'line-width': lineWidth,
                    },
                  });
                }
                map.current
                  .getSource('shape')
                  .setData(geojsonShapedata(data.shapes));
              });
            let content = `<p>${e.features[0].properties.trip_id}</p>`;
            new mapboxgl.Popup()
              .setLngLat(e.features[0].geometry.coordinates.slice())
              .setHTML(content)
              .addTo(map.current);
          });
        });
        setInterval(updateMap, 10000, map);
      });
    });
}

function geojsondata(data) {
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

function geojsonShapedata(data) {
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

function savePosition(map) {
  localStorage.setItem(
    'mapconfig',
    JSON.stringify({
      lng: map.current.getCenter().lng,
      lat: map.current.getCenter().lat,
      zoom: map.current.getZoom(),
    })
  );
}

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    initMap(mapContainer, map);
    displayPosition(map);
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('moveend', () => savePosition(map));
  });

  return <div ref={mapContainer} className={styles.map_container} />;
}
