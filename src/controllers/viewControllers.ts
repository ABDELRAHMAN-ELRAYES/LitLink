import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import { hash, compare } from '../utils/SecurityUtils';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

export const renderHome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render('index', {
      title: 'Home',
      // message: 'Username or Password is not correct, Try Again!.',
    });
  }
);

export const renderSignin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render('signin', {
      title: 'Signin',
      // message: 'Username or Password is not correct, Try Again!.',
    });
  }
);
