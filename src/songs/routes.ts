import { NextFunction, Request, Response, Router } from 'express';
import uuid = require('uuid');
import { bucket } from '../bucket';
import { ISong, SONG_NOT_FOUND_ERROR, SongsModel } from './model';

let songsModel: SongsModel;

export function init(model: SongsModel): Router {
    const router: Router = Router();

    songsModel = model;

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
        const songID: string = uuid.v4();

        // TODO: inject bucket class
        bucket
            .upload(songID, req)
            .then((songKey: string) => {
                const song: ISong = {
                    id: songID,
                    key: songKey
                };

                return songsModel
                    .insertSong(song);
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
                    songs: [],
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

        return songsModel
            .querySongByID(songID)
            .then((song: ISong) => {
                res.json(song);
            })
            .catch((err: Error) => {
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

        bucket
            .getObjectStream(req.param('song_id'))
            .pipe(res);

        // TODO: error handling?
        // TODO: content type response?

        // TODO: return binary song data
        res.sendStatus(404);
    });

    router.delete('/:song_id', (req: Request, res: Response, next: NextFunction) => {
        res.sendStatus(404);
    });

    return router;
}
