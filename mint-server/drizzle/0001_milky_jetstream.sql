-- Custom SQL migration file, put your code below! --
ALTER TABLE track_points
DROP COLUMN location;

ALTER TABLE track_points
ADD COLUMN location geometry(POINTZ, 4326) NOT NULL;