import { Router } from 'express';
import passport from '../middleware/googleOauth';
// import { loginWithGoogle } from '../controllers/authControllers';

const googleRouter = Router();

googleRouter.route('/').get(
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

googleRouter.route('/callback').get(
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  // loginWithGoogle
);

export default googleRouter;
