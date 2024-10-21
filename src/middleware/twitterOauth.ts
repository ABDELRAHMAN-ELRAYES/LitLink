import { Strategy as TwitterStrategy } from 'passport-twitter';
import passport from './googleOauth';
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.X_CLIENT_ID as string,
      consumerSecret: process.env.X_CLIENT_SECRET as string,
      callbackURL: process.env.X_CALLBACK as string,
    },
    (token, tokenSecret, profile, cb) => {
      return cb(null, profile);
    }
  )
);

export default passport;
