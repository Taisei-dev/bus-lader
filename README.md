## Visualize bus locations using GTFS real-time open data

You can check out the app on [Vercel](https://hiroshima-bus-monitor.vercel.app/).

## About

Locations of currently operating buses in Hiroshima are displayed on the map.  
Click on the icons for more information such as route,stops,and time.  
Using [GTFS-JP and GTFS real-time open data published by the Hiroshima Prefectural Bus Association](https://www.bus-kyo.or.jp/gtfs-open-data).  
See [this site](https://developers.google.com/transit) for more information about GTFS.

## Development

This project assumes database,so must be installed separately.  
Tools to setup database will come soon.  
The data source to be used can be changed by editing lib/constants.json.  
MAPBOX_ACCESS_TOKEN and POSTGRES_URL must be specified as environment variables.

## Technology used

| Category       | Technology stack                 |
| -------------- | -------------------------------- |
| Frontend       | Next.js, Chakra UI, Mapbox GL JS |
| Backend        | Next.js                          |
| Database       | Vercel Postgres                  |
| Infrastructure | Vercel                           |

## Features

- Light/Dark mode
- Auto update
- Distinguished by company color
- Direction
- Route/Stops visualization
- Selected icon highlighting
- Responsive detail drawer

## Upcoming Features

- [ ] Tools to setup and update databases
