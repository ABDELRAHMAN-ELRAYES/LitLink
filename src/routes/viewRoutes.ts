import { Router } from 'express';
import { renderLogin, renderHome } from '../controllers/viewControllers';
import { protect, isLoggedin } from '../controllers/authControllers';
const viewRouter = Router();

viewRouter.route('/login').get(renderLogin);
viewRouter.route('/home').get(protect, isLoggedin, renderHome);

export default viewRouter;
