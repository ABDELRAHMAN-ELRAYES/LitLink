import { Router } from 'express';
import { renderSignin, renderHome } from '../controllers/viewControllers';
const viewRouter = Router();

viewRouter.route('/').get(renderHome);
viewRouter.route('/signin').get(renderSignin);

export default viewRouter;
