import express = require('express');
import createError = require('http-errors');
import logger = require('morgan');
import database = require('./database');

import albumsRouter  = require('./albums/routes');
import artistsRouter = require('./artists/routes');
import songsRouter   = require('./songs/routes');

const app: express.Application = express();

app.disable('x-powered-by');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/albums', albumsRouter);
app.use('/artists', artistsRouter);
app.use('/songs', songsRouter);

app.use('/test', (req: express.Request, res: express.Response, _next: express.NextFunction): void => {
    database
        .query(' SELECT 1 ; ')
        .then(() => {
            res.sendStatus(204);
        })
        .catch((err: Error) => {
            console.log('/test error:', err);
            res.sendStatus(500);
        });
});

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(createError(404));
});

// error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const port: number = parseInt(process.env.PORT || '3000', 10);
app.set('port', port);

app.listen(port, () => {
    console.log('starting');
});

export = app;
