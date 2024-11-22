import 'express-async-errors';
import http from 'http';

import { IEmailMessageDetails, winstonLogger } from '@peter-lazarov/nodejs-reacjs-microservices-helper-library';
import { Logger } from 'winston';
//import { config } from '@notifications/config';
require('dotenv').config({ path: '.env.dev' });
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(process.env.ELASTIC_SEARCH_URL as string, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = await createConnection() as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);
  
  const verificationLink = `${process.env.CLIENT_URL}/confirm_email?v_token=123`
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: `${process.env.SENDER_EMAIL}`,
    verifyLink: verificationLink,
    template: `verifyEmail`
  };
  
  //Test sending of email
  await emailChannel.assertExchange('jobber-email-notification', 'direct');
  const message = JSON.stringify(messageDetails);
  emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message));

  //Test RabbitMQ
  // await emailChannel.assertExchange('jobber-email-notification', 'direct');
  // const message = JSON.stringify({name: 'Peter', service: 'notification service'});
  // emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message));
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
