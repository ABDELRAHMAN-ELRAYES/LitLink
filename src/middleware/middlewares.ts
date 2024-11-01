import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from './googleOauth';
import cors from 'cors';
import { uploadImage } from './uploadImages';

export const morganMiddleware = morgan('dev');
export const bodyParserMiddleware = express.json();
export const formParser = express.urlencoded({ extended: true });
export const cookieParserMiddleware = cookieParser();
export const passportInitializationMiddleware = passport.initialize();
export const corsMiddleware = cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
export const uploadUserImageMiddleware = uploadImage('users', 'profilePicture');
