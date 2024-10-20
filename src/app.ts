import express, { Request, Response, NextFunction } from 'express';
import {
  bodyParserMiddleware,
  formParser,
  morganMiddleware,
  cookieParserMiddleware,
  passportInitializationMiddleware,
} from './middleware/middlewares';
import path from 'path';
import userRouter from './routes/userRoutes';
import viewRouter from './routes/viewRoutes';
import { catchErrorMiddleware } from './middleware/catchError';
import TwitterRouter from './routes/twitterRoutes';
import googleRouter from './routes/googleRoutes';
import session from 'express-session';
import passport from './middleware/twitterOauth';
// create express app
const app = express();

// using middlewares
app.use(bodyParserMiddleware);
app.use(formParser);
app.use(morganMiddleware);
app.use(cookieParserMiddleware);
app.use(passportInitializationMiddleware);

//!----------------------------------------------------

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//!----------------------------------------------------
// define the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// define public  static files
app.use(express.static(path.join(__dirname, 'public')));

// mounting routers
app.use('/', viewRouter);
app.use('/users', userRouter);
app.use('/auth/twitter', TwitterRouter);
app.use('/auth/google', googleRouter);

// Global Error Handling
app.use(catchErrorMiddleware);
export default app;
