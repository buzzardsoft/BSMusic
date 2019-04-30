import createError = require('http-errors');
import express = require('express');
import path = require('path');
// var cookieParser = require('cookie-parser');
import logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const app: express.Application = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.json({ 'message': 'hello' });
});
// app.use('/users', usersRouter);

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


let port: number = parseInt(process.env.PORT || '3000', 10);
app.set('port', port);

app.listen(port, () => {
    console.log('starting');
});

export = app;
