import { NextFunction, Request, Response, Router } from 'express';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(201);
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        albums: [],
    });
});

router.get('/:album_id', (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404);
});

router.delete('/:album_id', (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404);
});

export = router;
