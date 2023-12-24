## Visualize bus locations using GTFS real-time open data

You can check out the app on [Vercel](https://hiroshima-bus-monitor.vercel.app/)

## About

Locations of currently operating buses in Hiroshima are displayed on the map.

Using [GTFS-JP and GTFS real-time open data published by the Hiroshima Prefectural Bus Association](https://www.bus-kyo.or.jp/gtfs-open-data)

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

## Upcoming Features

- [ ] Tools to setup and update databases
