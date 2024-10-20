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
      console.log('Token:', token);
      console.log('Token Secret:', tokenSecret);
      console.log('Profile:', profile);
      return cb(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});
export default passport;
