import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { IProfile } from '../interface/IProfile';
import { generateUniqueUsernameFromEmail } from '../utils/generateUsername';

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      // check if the user already registered
      const email = (profile as IProfile).emails[0].value;
      const userIsFound = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      // if the user found login
      if (userIsFound) return done(null, profile);

      // if the user is not found signup user
      const profilePicture = (profile as IProfile).photos[0].value;
      const name = (profile as IProfile).displayName;

      // generate unique username for user
      let username = generateUniqueUsernameFromEmail(email);

      // check if the generated username is already assigned to specific user
      while (true) {
        let checkUsernameIfFound = await prisma.user.findFirst({
          where: {
            username,
          },
        });
        if (checkUsernameIfFound) {
          username = generateUniqueUsernameFromEmail(email);
        } else {
          break;
        }
      }
      const password = process.env.DEFAULT_USER_PASSWORD as string;

      // register with user data
      const user = await prisma.user.create({
        data: {
          name,
          email,
          username,
          password,
          profilePicture,
        },
      });
      return done(null, profile);
    }
  )
);
export default passport;
