import { Router } from 'express';
import { renderLogin, renderHome } from '../controllers/viewControllers';
import {
  protect,
  isLoggedin,
  isOnSession,
} from '../controllers/authControllers';
const viewRouter = Router();

viewRouter.route('/').get(protect, isLoggedin, renderHome);
viewRouter.route('/home').get(protect, isLoggedin, renderHome);
viewRouter.route('/login').get(isOnSession, renderLogin);
export default viewRouter;
