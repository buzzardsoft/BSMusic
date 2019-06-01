import { NextFunction, Request, Response, Router } from 'express';
import * as uuid from 'uuid';
import { bucket } from '../bucket';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    bucket
        .upload(uuid.v4(), req)
        .then(() => {
            // TODO: need to write song to database
            // TODO: probably need to return a JSON payload to reference file
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
