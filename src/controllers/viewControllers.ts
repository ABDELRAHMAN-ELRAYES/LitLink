import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import { hash, compare } from '../utils/SecurityUtils';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

export const renderHome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tweets = await prisma.tweet.findMany({
      include: {
        media: true,
        createdBy: true,
      },
    });
    res.status(200).render('home', {
      title: 'Home',
      tweets,
    });
  }
);

export const renderLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render('login', {
      title: 'Signin',
      // message: 'Username or Password is not correct, Try Again!.',
    });
  }
);
