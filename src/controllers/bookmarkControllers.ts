import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// bookmark a tweet or a reply
export const bookmarkTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tweetId = req.params?.bookmarkId as string;
    const userId = req.user?.id as string;
    const bookmark = await prisma.bookmark.create({
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
// remove a bookmarked tweet or reply from bookmarks
export const removeBookmarkedTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tweetId = req.params?.bookmarkId as string;
    const userId = req.user?.id as string;
    const bookmark = await prisma.bookmark.delete({
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
