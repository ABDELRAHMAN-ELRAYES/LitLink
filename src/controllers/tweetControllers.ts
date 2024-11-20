import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { IMedia } from '../interface/IMedia';
const prisma = new PrismaClient();

// create new tweet
export const createNewTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get all data and media selected by user to put in tweet from req.body
    const { content } = req.body;
    const createdById = req.user?.id as string; // if i used protect middleware
    // const createdById = req.params.userId as string;
    const selectedMediaFiles = req.files as Express.Multer.File[];

    // processing and manipulate the selected media files
    const postMedia = selectedMediaFiles.map((file) => {
      const mediaFile: IMedia = {
        filename: file.filename,
        mimeType: file.mimetype,
        path: file.path,
      };
      return mediaFile;
    });

    // create the tweet
    const tweet = await prisma.tweet.create({
      data: {
        content,
        createdById,
      },
    });

    // use tweet id to create its media
    const allPostMedia = postMedia.map((file) => ({
      tweetId: tweet.id,
      url: file.filename,
    }));
    const media = await prisma.media.createMany({ data: allPostMedia });

    res.status(200).json({
      tweet,
    });
  }
);