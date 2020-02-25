import { Router } from 'express';

import DataController from './controllers/DataController';

const routes = new Router();

routes.get('/statistics', DataController.index);

export default routes;
