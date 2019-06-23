import { NextFunction, Request, Response, Router } from 'express';
import * as mm from 'music-metadata';
import uuid = require('uuid');
import { Bucket } from '../bucket';
import { ISong, SONG_NOT_FOUND_ERROR, SongsModel } from './model';

let songsModel: SongsModel;
let bucket: Bucket;

export function init(model: SongsModel, s3Bucket: Bucket ): Router {
    const router: Router = Router();

    songsModel = model;
    bucket = s3Bucket;

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
        const songID: string = uuid.v4();

        bucket
            .upload(songID, req)
            .then((songKey: string) => {
                const song: ISong = {
                    id: songID,
                    key: songKey
                };

                // TODO: Metadata parsing should probably be queued and handled elsewhere asynchronously.
                // Currently re-reading song from S3 and streaming through parser
                return mm
                    .parseStream(bucket.getObjectStream(songKey))
                    .then(((metadata: mm.IAudioMetadata) => {
                        song.metadata = metadata;
                        return Promise.resolve(song);
                    }));
            })
            .then((song: ISong) => {
                return songsModel.insertSong(song);
            })
            .then(() => {
                // TODO: probably need to return a JSON payload to reference file
                res
                    .json({
                        id: songID
                    })
                    .sendStatus(201);
            })
            .catch((err: Error) => {
                console.log('failed to upload song:', err);
                // TODO: needs more selective error returns
                res.sendStatus(500);
            });
    });

    router.get('/', (req: Request, res: Response, next: NextFunction) => {

        songsModel
            .querySongs()
            .then((songs: ISong[]) => {
                res.json({
                    songs: songs || [],
                });
            })
            .catch((err: Error) => {
                console.log('failed to query songs:', err);
                // TODO: needs more selective error returns
                res.sendStatus(500);
            });
    });

    router.get('/:song_id', (req: Request, res: Response, next: NextFunction) => {
        const songID: string = req.param('song_id');
        if (!songID) {
            res.sendStatus(400);
            return;
        }

        songsModel
            .querySongByID(songID)
            .then((song: ISong) => {
                res.json(song);
            })
            .catch((err: Error) => {
                console.log('failed to query song by id:', songID, 'error:', err);
                switch (err.name) {
                    case SONG_NOT_FOUND_ERROR:
                        res.sendStatus(404);
                        break;
                    default:
                        res.sendStatus(500);
                        break;
                }
            });
    });

    router.get('/:song_id/file', (req: Request, res: Response, next: NextFunction) => {
        const songID: string = req.param('song_id');
        if (!songID) {
            res.sendStatus(400);
            return;
        }

        songsModel
            .querySongByID(songID)
            .then((song: ISong) => {
                // TODO: content type?
                return bucket
                    .getObjectStream(song.key)
                    .pipe(res);
            })
            .catch((err: Error) => {
                console.log('failed to download song file for id:', songID, 'error:', err);
                switch (err.name) {
                    case SONG_NOT_FOUND_ERROR:
                        res.sendStatus(404);
                        break;
                    default:
                        res.sendStatus(500);
                        break;
                }
            });
    });

    router.delete('/:song_id', (req: Request, res: Response, next: NextFunction) => {
        const songID: string = req.param('song_id');
        if (!songID) {
            res.sendStatus(400);
            return;
        }

        songsModel
            .querySongByID(songID)
            .then((song: ISong) => {
                return bucket.delete(song.key);
            })
            .then(() => {
                return songsModel.deleteSong(songID);
            })
            .then(() => {
                res.sendStatus(204);
            })
            .catch((err: Error) => {
                console.log('failed to delete song for id:', songID, 'error:', err);
                res.sendStatus(500);
            });
    });

    return router;
}
