import * as assert from 'assert';
import Promise = require('bluebird');
import { Sequelize } from 'sequelize';

export interface ISong {
    id: string;     // uuid
    key: string;    // S3 bucket key,
    metadata?: any; // audio metadata
}

export const SONG_NOT_FOUND_ERROR: string = 'SONG_NOT_FOUND';

export class SongsModel {
    constructor(private readonly db: Sequelize) {
    }

    public insertSong(song: ISong): Promise<void> {
        assert(song);
        assert(song.id);
        assert(song.key);

        return this.db
            .query(
                `
                INSERT INTO song ( id, key, metadata )
                    VALUES ( :id, :key, :metadata ) ;
                `,
                {
                    replacements: {
                        id: song.id,
                        key: song.key,
                        metadata: JSON.stringify(song.metadata || {})
                    }
                }
            )
            .then(() => {
                return Promise.resolve();
            });
    }

    public deleteSong(songID: string): Promise<void> {
        assert(songID);

        return this.db
            .query(
                `
                DELETE FROM song
                      WHERE id = :id
                `,
                { replacements: { id: songID } }
            )
            .then(() => {
                return Promise.resolve();
            });
    }

    public querySongs(): Promise<ISong[]> {
        return this.db
            .query(
                `
                SELECT *
                  FROM song ;
                `
            )
            .spread((rows: unknown[]): ISong[] => {
                // database and ISong currently match, no need to remap
                return (rows || []) as ISong[];
            });
    }

    public querySongByID(songID: string): Promise<ISong> {
        assert(songID);

        return this.db
            .query(
                `
                SELECT *
                  FROM song
                 WHERE id = :song_id ;
                `,
                {
                    replacements: {
                        song_id: songID
                    }
                }
            )
            .spread((rows: unknown[]): Promise<ISong> => {
                if (!rows || rows.length !== 1) {
                    return Promise.reject({
                        name: SONG_NOT_FOUND_ERROR,
                        message: SONG_NOT_FOUND_ERROR + ': Missing song data for song ID \'' + songID + '\''
                    });
                }

                return Promise.resolve(rows[0] as ISong);
            });
    }
}
