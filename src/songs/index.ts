import { Application } from 'express';
import { Sequelize } from 'sequelize';
import { SongsModel } from './model';
import * as routes from './routes';
import { Bucket } from '../bucket';

export function init(db: Sequelize, bucket: Bucket, app: Application): void {
    app.use('/songs', routes.init(new SongsModel(db), bucket));
}
