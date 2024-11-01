import { Router } from 'express';
import passport from '../middleware/twitterOauth';
// import { loginWithTwitter } from '../controllers/authControllers';
const TwitterRouter = Router();

TwitterRouter.route('/').get(
  passport.authenticate('twitter', {
    scope: ['profile', 'email'],
    session: false,
  })
);

TwitterRouter.route('/callback').get(
  passport.authenticate('twitter', {
    failureRedirect: '/signin',
    session: false,
  })
  // loginWithTwitter
);

export default TwitterRouter;
