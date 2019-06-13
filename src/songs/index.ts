import { Application } from 'express';
import { Sequelize } from 'sequelize';
import { SongsModel } from './model';
import * as routes from './routes';

export function init(db: Sequelize, app: Application): void {
    app.use('/songs', routes.init(new SongsModel(db)));
}
