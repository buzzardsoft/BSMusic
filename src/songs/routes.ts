import { NextFunction, Request, Response, Router } from 'express';
import * as uuid from 'uuid';
import { bucket } from '../bucket';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    bucket
        .upload(uuid.v4(), req)
        .then(() => {
            // TODO: need to write song to database
            // TODO: probably need a JSON payload to reference file
            res.sendStatus(201);
        })
        .catch((err: Error) => {
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
    // TODO: return JSON song metadata
    res.sendStatus(404);
});

router.get('/:song_id/file', (req: Request, res: Response, next: NextFunction) => {
    // TODO: return binary song data
    res.sendStatus(404);
});

router.delete('/:song_id', (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404);
});

export = router;
