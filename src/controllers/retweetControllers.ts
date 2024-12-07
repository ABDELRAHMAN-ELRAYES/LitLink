import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// retweet a tweet or a reply
export const retweetATweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tweetId = req.params?.retweetId as string;
    const userId = req.user?.id as string;
    const bookmark = await prisma.retweet.create({
      data: {
        tweetId,
        userId,
      },
    });

    res.status(200).json({
      status: 'bookmark',
      tweetId,
      userId,
    });
  }
);
// remove a reatweet from a tweet or a reply 
export const unRetweetATweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tweetId = req.params?.retweetId as string;
    const userId = req.user?.id as string;
    const bookmark = await prisma.retweet.delete({
      where: {
        userId_tweetId: {
          tweetId,
          userId,
        },
      },
    });
    res.status(200).json({
      status: 'remove bookmark',
      tweetId,
      userId,
    });
  }
);
