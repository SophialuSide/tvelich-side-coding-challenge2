import express from 'express';
import { propertyRoutes } from './routes';
import {
  requestValidationMiddleware,
  unexpectedErrorMiddleware,
} from './middlewares';

const app = express();
app.use('/properties', propertyRoutes);
app.use(requestValidationMiddleware);
app.use(unexpectedErrorMiddleware);
export default app;
