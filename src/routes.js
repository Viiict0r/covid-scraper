import { Router } from 'express';

import DataController from './controllers/DataController';
import CoordController from './controllers/CoordController';

const routes = new Router();

routes.get('/statistics', DataController.index);
routes.get('/coords', CoordController.index);

export default routes;
