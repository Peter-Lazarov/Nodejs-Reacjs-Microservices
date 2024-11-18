import { winstonLogger } from '@peter-lazarov/nodejs-reacjs-microservices-helper-library';
import { Logger } from 'winston';
//import { config } from '@notifications/config';
require('dotenv').config({ path: '.env.dev' });
import express, { Express } from 'express';
import { start } from 'src/server';

//Just for print
// const pino = require('pino');
// const logger = pino({
//   level: process.env.LOG_LEVEL || 'info',
//   prettyPrint: process.env.NODE_ENV !== 'production'
// });

// logger.info({ service1: 'notificationServer', message: 'Server has started here 1' });
// logger.error({ service2: 'notificationServer', message: 'An error occurred' });

const log: Logger = winstonLogger(process.env.ELASTIC_SEARCH_URL as string, 'notificationApp', 'debug');

function initialize(): void {
  const app: Express = express();
  start(app);
  log.info('Notification Service Initialized');
}
initialize();
