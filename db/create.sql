create table trips (
trip_id TEXT NOT NULL,
shape_id TEXT NOT NULL,
PRIMARY KEY (trip_id)
);
CREATE TABLE stop_times (
trip_id TEXT NOT NULL,
stop_sequence INTEGER NOT NULL,
arrival_time TEXT NOT NULL,
departure_time TEXT NOT NULL,
stop_id TEXT NOT NULL,
stop_name TEXT NOT NULL,
stop_lat REAL NOT NULL,
stop_lon REAL NOT NULL
);
CREATE TABLE shapes (
shape_id TEXT NOT NULL,
shape_pt_sequence INTEGER NOT NULL,
shape_pt_lat REAL NOT NULL,
shape_pt_lon REAL NOT NULL
);