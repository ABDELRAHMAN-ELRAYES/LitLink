import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import { hash, compare } from '../utils/SecurityUtils';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

// render home page
export const renderHome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get all tweets in timeline
    const tweets = await prisma.tweet.findMany({
      include: {
        media: true,
        createdBy: true,
        likes: true,
      },
    });
    const userId = req.user?.id;

    // get all likeed tweets by current user
    const currentUserLikedTweets = await prisma.like.findMany({
      where: {
        userId,
      },
      select: {
        tweetId: true,
      },
    });

    // get all bookmarked tweets and replies by current user
    const currentUserBookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
      },
      select: {
        tweetId: true,
      },
    });
    res.status(200).render('_render-tweets', {
      title: 'Home',
      tweets,
      currentUserLikedTweets,
      currentUserBookmarks,
    });
  }
);

// render current user bookmarks
export const renderBookmarks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    // get all likeed tweets by current user
    const currentUserLikedTweets = await prisma.like.findMany({
      where: {
        userId,
      },
      select: {
        tweetId: true,
      },
    });

    // get all bookmarked tweets and replies by current user
    const currentUserBookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
      },
      select: {
        tweet: {
          include: {
            media: true,
            createdBy: true,
            likes: true,
          },
        },
      },
    });
    // currentUserBookmarks.forEach((item) => {
    //   console.log(item?.tweet);
    // });

    res.status(200).render('_render-bookmarks', {
      title: 'Bookmarks',
      currentUserLikedTweets,
      currentUserBookmarks,
    });
  }
);

export const renderLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render('login', {
      title: 'Login',
      // message: 'Username or Password is not correct, Try Again!.',
    });
  }
);
