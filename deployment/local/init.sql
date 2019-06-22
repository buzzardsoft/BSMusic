CREATE ROLE bsmusic_app WITH LOGIN PASSWORD 'bsmusic_password' VALID UNTIL 'infinity' ;
GRANT CONNECT ON DATABASE bsmusic TO bsmusic_app ;

REVOKE CREATE ON schema public FROM public ;
GRANT CREATE ON schema public TO bsmusic_admin ;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES ON TABLES TO bsmusic_app ;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON sequences TO bsmusic_app ;
GRANT TEMP ON DATABASE bsmusic TO bsmusic_app ;

CREATE TABLE IF NOT EXISTS song (
    id UUID PRIMARY KEY,
    key TEXT NOT NULL,
    metadata JSONB 
) ;
CREATE INDEX song_metadata_idx ON song USING gin (metadata);
