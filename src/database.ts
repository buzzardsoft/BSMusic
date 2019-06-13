import { Sequelize } from 'sequelize';

import { config } from './config';

const database: Sequelize = new Sequelize({
    database  : config.getDatabaseName(),
    dialect   : 'postgres',
    host      : config.getDatabaseHost(),
    password  : config.getDatabasePassword(),
    port      : config.getDatabasePort(),
    username  : config.getDatabaseUsername()
});

export = database;
