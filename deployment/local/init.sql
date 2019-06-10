CREATE ROLE bsmusic_app WITH LOGIN PASSWORD 'bsmusic_password' VALID UNTIL 'infinity' ;

REVOKE CREATE ON DATABASE bsmusic FROM bsmusic_app ;

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES ON ALL TABLES IN SCHEMA public TO bsmusic_app ;
GRANT USAGE, SELECT, UPDATE ON ALL sequences IN SCHEMA public TO bsmusic_app ;
GRANT CONNECT ON DATABASE bsmusic TO bsmusic_app ;
GRANT TEMP ON DATABASE bsmusic TO bsmusic_app ;

CREATE TABLE IF NOT EXISTS song (
    id UUID PRIMARY KEY,
    key TEXT NOT NULL,
    metadata JSONB 
) ;
CREATE INDEX song_metadata_idx ON song USING gin (metadata);
