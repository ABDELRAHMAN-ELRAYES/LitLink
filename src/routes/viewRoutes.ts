import { Router } from 'express';
import { renderLogin, renderHome } from '../controllers/viewControllers';
import {
  protect,
  isLoggedin,
  isOnSession,
} from '../controllers/authControllers';
const viewRouter = Router();

viewRouter.route('/login').get(isOnSession, renderLogin);
viewRouter.route('/home').get( protect, isLoggedin, renderHome);

export default viewRouter;
