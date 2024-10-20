import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from './twitterOauth';

export const morganMiddleware = morgan('dev');
export const bodyParserMiddleware = express.json();
export const formParser = express.urlencoded({ extended: true });
export const cookieParserMiddleware = cookieParser();
export const passportInitializationMiddleware = passport.initialize();
