import { Router } from 'express';
import {
  renderLogin,
  renderHome,
  renderBookmarks,
} from '../controllers/viewControllers';
import {
  protect,
  isLoggedin,
  isOnSession,
} from '../controllers/authControllers';
const viewRouter = Router();

viewRouter.route('/login').get(isOnSession, renderLogin);

viewRouter.use(protect, isLoggedin);

viewRouter.route('/').get(renderHome);
viewRouter.route('/home').get(renderHome);
viewRouter.route('/bookmarks').get(renderBookmarks);

export default viewRouter;
