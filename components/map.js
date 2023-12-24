'use client';
import React, { useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './map.module.css';
import constants from '../lib/constants.json';
import { useTheme } from 'next-themes';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

function initMap(mapContainer, map, style) {
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
    style: style,
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

async function loadImage(map, url) {
  return new Promise((resolve) => {
    map.current.loadImage(url, (err, image) => resolve(image));
  });
}

async function showShapes(map, resolvedTheme, shapeStopData) {
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
        'line-color': resolvedTheme == 'light' ? '#000' : '#ddd',
        'line-width': resolvedTheme == 'light' ? 5 : 3,
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
  map.current.getSource('shape').setData(shapeStopData.shapes);

  map.current.getSource('stop_positions').setData(shapeStopData.stops);
  map.current.on('click', 'stops', (e) => {
    let content = `<p>${e.features[0].properties.stop_name}</p>`;
    new mapboxgl.Popup()
      .setLngLat(e.features[0].geometry.coordinates.slice())
      .setOffset(20)
      .setHTML(content)
      .addTo(map.current);
  });
}

async function initVehicleLayer(map, resolvedTheme, clickHandler) {
  const busImage = await loadImage(map, '/busicon.png');
  if (map.current.hasImage('mapicon')) {
    return;
  }
  map.current.addImage('mapicon', busImage, { sdf: true });
  const stopImage = await loadImage(map, '/stopicon.png');
  map.current.addImage('stopicon', stopImage);
  if (map.current.getSource('vehicle_positions')) {
    return;
  }
  map.current.addSource('vehicle_positions', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
    promoteId: 'trip_id',
  });
  map.current.addLayer({
    id: 'vehicles',
    type: 'symbol',
    source: 'vehicle_positions',
    layout: {
      'icon-image': 'mapicon',
      'icon-size': 0.25,
      'icon-anchor': 'top',
      'icon-allow-overlap': true,
      'icon-rotate': ['get', 'bearing'],
      'icon-rotation-alignment': 'map',
    },
    paint: {
      'icon-color': [
        'get',
        'color',
        ['get', ['get', 'company_id'], ['literal', constants]],
      ],
      'icon-halo-color': resolvedTheme == 'light' ? '#000' : '#fff',
      'icon-halo-width': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        0.7,
        0,
      ],
    },
  });
  map.current.on('click', 'vehicles', (e) => {
    map.current.removeFeatureState({
      source: 'vehicle_positions',
      id: selectedTripId,
    });
    const tripId = e.features[0].id;
    map.current.setFeatureState(
      { source: 'vehicle_positions', id: tripId },
      { selected: true }
    );
    selectedTripId = tripId;
    clickHandler(tripId);
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

let selectedTripId = null,
  _vehicleData,
  _shapeStopData,
  _resolvedTheme;

export default function Map({ clickHandler, vehicleData, shapeStopData }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { resolvedTheme } = useTheme();
  _vehicleData = vehicleData;
  _shapeStopData = shapeStopData;
  _resolvedTheme = resolvedTheme;
  function onload() {
    initVehicleLayer(map, _resolvedTheme, clickHandler).then(() => {
      map.current.getSource('vehicle_positions').setData(_vehicleData);
      showShapes(map, _resolvedTheme, _shapeStopData);
      if (selectedTripId) {
        map.current.setFeatureState(
          { source: 'vehicle_positions', id: selectedTripId },
          { selected: true }
        );
      }
    });
  }

  useEffect(() => {
    initMap(
      mapContainer,
      map,
      `mapbox://styles/mapbox/${
        resolvedTheme == 'light' ? 'streets-v12' : 'dark-v11'
      }`
    );
    map.current.on('moveend', () => savePosition(map));
    map.current.on('style.load', onload);
  }, []);

  useEffect(() => {
    _resolvedTheme = resolvedTheme;
    if (!map.current) {
      return;
    } else {
      map.current.setStyle(
        `mapbox://styles/mapbox/${
          resolvedTheme == 'light' ? 'streets-v12' : 'dark-v11'
        }`
      );
    }
  }, [resolvedTheme]);

  useEffect(() => {
    _vehicleData = vehicleData;
    if (map.current && map.current.getSource('vehicle_positions')) {
      map.current.getSource('vehicle_positions').setData(vehicleData);
    }
  }, [vehicleData]);

  useEffect(() => {
    _shapeStopData = shapeStopData;
    if (map.current && map.current.isStyleLoaded()) {
      showShapes(map, resolvedTheme, shapeStopData);
    }
  }, [shapeStopData]);

  return <div ref={mapContainer} className={styles.map_container} />;
}
