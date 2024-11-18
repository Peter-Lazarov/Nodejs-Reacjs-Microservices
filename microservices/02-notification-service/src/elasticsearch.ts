import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
//import { config } from '@notifications/config';
require('dotenv').config({ path: '.env.dev' });
import { winstonLogger } from '@peter-lazarov/nodejs-reacjs-microservices-helper-library';
import { Logger } from 'winston';

const log: Logger = winstonLogger(process.env.ELASTIC_SEARCH_URL as string, 'notificationElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: process.env.ELASTIC_SEARCH_URL
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`NotificationService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'NotificationService checkConnection() method:', error);
    }
  }
}
