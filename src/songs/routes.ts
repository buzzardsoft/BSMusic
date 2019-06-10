import { NextFunction, Request, Response, Router } from 'express';
import * as uuid from 'uuid';
import { bucket } from '../bucket';
import * as database from '../database';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    const songID: string = uuid.v4();
    bucket
        .upload(songID, req)
        .then((songKey: string) => {
            return database
                .query(
                    `
                    INSERT INTO song ( id, key )
                         VALUES ( :id, :key ) ;
                    `,
                    {
                        replacements: {
                            id: songID,
                            key: songKey
                        }
                    }
                );
        })
        .then(() => {
            // TODO: need to write song to database
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
    // TODO: return list of all songs
    res.json({
        songs: [],
    });
});

router.get('/:song_id', (req: Request, res: Response, next: NextFunction) => {
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
});

router.get('/:song_id/file', (req: Request, res: Response, next: NextFunction) => {
    // TODO: return binary song data
    res.sendStatus(404);
});

router.delete('/:song_id', (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404);
});

export = router;
