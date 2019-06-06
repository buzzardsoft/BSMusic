CREATE DATABASE IF NOT EXISTS mymusic ;

CREATE TABLE IF NOT EXISTS song (
    id UUID PRIMARY KEY,
    key TEXT NOT NULL,
    metadata JSONB 
) ;
CREATE INDEX song_metadata_idx ON song USING gin (metadata);
