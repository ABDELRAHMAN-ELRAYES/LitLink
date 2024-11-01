import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

export const createNewPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany();
    res.status(200).json({
      users,
    });
  }
);
