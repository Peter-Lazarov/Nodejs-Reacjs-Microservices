import { verifyGatewayRequest } from '@peter-lazarov/nodejs-reacjs-microservices-helper-library';
import { Application } from 'express';
import { healthRoutes } from '@order/routes/health';
import { orderRoutes } from '@order/routes/order';

const BASE_PATH = '/api/v1/order';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, orderRoutes());
};

export { appRoutes };
