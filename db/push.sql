attach database "19.sqlite3" as prev;
insert into main.trips select trip_id,shape_id from prev.trips;
insert into main.stop_times 
    select prev.stop_times.trip_id,prev.stop_times.stop_sequence,prev.stop_times.arrival_time,prev.stop_times.departure_time,prev.stop_times.stop_id,prev.stops.stop_name,prev.stops.stop_lat,prev.stops.stop_lon
    from prev.stop_times
     inner join prev.stops 
     on prev.stop_times.stop_id = prev.stops.stop_id;
insert into main.shapes select * from prev.shapes;
detach prev;