'use client';
import React, { useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './map.module.css';
import { busColors, lineColor, lineWidth } from '../lib/constants';
import {
  geojsonShapedata,
  geojsonStopdata,
  geojsonVehicledata,
} from '../lib/geojson';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

function initMap(mapContainer, map) {
  let mapConfig = JSON.parse(localStorage.getItem('mapconfig'));
  if (!mapConfig) {
    mapConfig = {
      lng: 132.4587,
      lat: 34.4049,
      zoom: 12,
    };
  }
  map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [mapConfig.lng, mapConfig.lat],
    zoom: mapConfig.zoom,
  });
  map.current.addControl(new MapboxLanguage());
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
      map.current
        .getSource('vehicle_positions')
        .setData(geojsonVehicledata(data));
    });
}

async function loadImage(map, url) {
  return new Promise((resolve) => {
    map.current.loadImage(url, (err, image) => resolve(image));
  });
}

function onVehicleClick(map, setTripId, setStopTimes, e) {
  {
    fetch(`/api/trip_detail?trip_id=${e.features[0].properties.trip_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!map.current.getSource('shape')) {
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
        if (!map.current.getSource('stop_positions')) {
          map.current.addSource('stop_positions', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });
          map.current.addLayer({
            id: 'stops',
            type: 'symbol',
            source: 'stop_positions',
            layout: {
              'icon-image': 'stopicon',
              'icon-size': 0.2,
              'icon-allow-overlap': true,
            },
          });
        }
        map.current.getSource('shape').setData(geojsonShapedata(data.shapes));

        map.current
          .getSource('stop_positions')
          .setData(geojsonStopdata(data.stopTimes));
        map.current.on('click', 'stops', (e) => {
          let content = `<p>${e.features[0].properties.stop_name}</p>`;
          new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates.slice())
            .setOffset(20)
            .setHTML(content)
            .addTo(map.current);
        });
        setStopTimes(data.stopTimes);
      });
    setTripId(e.features[0].properties.trip_id);
  }
}

function displayVehicles(map, setTripId, setStopTimes) {
  fetch('api/vehicle_position')
    .then((res) => res.json())
    .then((data) => {
      map.current.on('load', async function () {
        const busImage = await loadImage(map, '/busicon.png');
        map.current.addImage('mapicon', busImage, { sdf: true });
        const stopImage = await loadImage(map, '/stopicon.png');
        map.current.addImage('stopicon', stopImage);
        map.current.addSource('vehicle_positions', {
          type: 'geojson',
          data: geojsonVehicledata(data),
        });
        map.current.addLayer({
          id: 'vehicles',
          type: 'symbol',
          source: 'vehicle_positions',
          layout: {
            'icon-image': 'mapicon',
            'icon-size': 0.2,
            'icon-anchor': 'top',
            'icon-allow-overlap': true,
            'icon-rotate': ['get', 'bearing'],
            'icon-rotation-alignment': 'map',
          },
          paint: {
            'icon-color': [
              'get',
              ['concat', 'bus', ['get', 'company_id']],
              ['literal', busColors],
            ],
          },
        });
        map.current.on('click', 'vehicles', (e) =>
          onVehicleClick(map, setTripId, setStopTimes, e)
        );
        setInterval(updateMap, 10000, map);
      });
    });
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

export default function Map({ setTripId, setStopTimes }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  useEffect(() => {
    initMap(mapContainer, map);
    map.current.on('moveend', () => savePosition(map));

    displayVehicles(map, setTripId, setStopTimes);
  }, []);
  return <div ref={mapContainer} className={styles.map_container} />;
}
