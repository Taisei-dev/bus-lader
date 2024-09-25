## Visualize bus locations using GTFS real-time open data

You can check out the app on [Vercel](https://tokyo-bus-lader.vercel.app/).

## About

Locations of currently operating buses displayed on the map.  
Click on the icons for more information such as route,stops,and time.  
Using [GTFS-JP and GTFS real-time open data by Bureau of Transportation, Tokyo Metropolitan Government / Association for Open Data of Public Transportation](https://ckan.odpt.org/dataset/b_bus_gtfs_jp-toei).  
See [this site](https://developers.google.com/transit) for more information about GTFS.

## Development

This project assumes database,so must be installed separately.  
[Here](https://github.com/Taisei-dev/bus-lader-db-tool) is CLI to setup database.  
The data source to be used can be changed by editing lib/constants.json.  
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN and DATABASE_URL must be specified as environment variables.

## Technology used

| Category       | Technology stack                 |
| -------------- | -------------------------------- |
| Frontend       | Next.js, Chakra UI, Mapbox GL JS |
| Backend        | Next.js, Prisma                  |
| Database       | Supabase                         |
| Infrastructure | Vercel                           |

## Features

- Light/Dark mode
- Auto update
- Distinguished by company color
- Vehicle direction
- Route/Stops visualization
- Selected icon highlighting
- Responsive detail drawer
- Save last map location
- CLI to setup and update databases
