import { Router } from 'express';
import {
  renderLogin,
  renderHome,
  renderBookmarks,
  renderProfile
} from '../controllers/viewControllers';
import {
  protect,
  isLoggedin,
  isOnSession,
} from '../controllers/authControllers';
const viewRouter = Router({mergeParams:true});

viewRouter.route('/login').get(isOnSession, renderLogin);

viewRouter.use(protect, isLoggedin);

viewRouter.route('/').get(renderHome);
viewRouter.route('/home').get(renderHome);
// viewRouter.route('/bookmarks').get(renderBookmarks);
viewRouter.route('/bookmarks').get(renderBookmarks);

viewRouter.route('/profile/:username').get(renderProfile)

export default viewRouter;
