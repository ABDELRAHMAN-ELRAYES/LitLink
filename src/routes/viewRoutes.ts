import { Router } from 'express';
import { renderLogin, renderHome } from '../controllers/viewControllers';
const viewRouter = Router();

viewRouter.route('/').get(renderHome);
viewRouter.route('/login').get(renderLogin);

export default viewRouter;
