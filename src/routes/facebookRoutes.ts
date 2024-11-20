import { Router } from 'express';
import passport from '../middleware/facebookOauth';
import { loginWithFacebook } from '../controllers/authControllers';

const facebookRouter = Router();

facebookRouter.route('/').get(
  passport.authenticate('facebook', {
    // scope: ['profile', 'email'],
    session: false,
  })
);

facebookRouter.route('/callback').get(
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false,
  }),
  loginWithFacebook
);

export default facebookRouter;
