import * as assert from 'assert';
import Promise = require('bluebird');
import { Sequelize } from 'sequelize';

export interface ISong {
    id: string;     // uuid
    key: string;    // S3 bucket key
}

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
                INSERT INTO song ( id, key )
                    VALUES ( :id, :key ) ;
                `,
                {
                    replacements: {
                        id: song.id,
                        key: song.key
                    }
                }
            )
            .then(() => {
                return Promise.resolve();
            });
    }

    public querySongs(): Promise<ISong[]> {
        return this.db
            .query(
                `
                SELECT * from song ;
                `
            )
            .then((rows: unknown[]) => {
                // database and ISong currently match, no need to remap
                return (rows || []) as ISong[];
            });
    }
}
