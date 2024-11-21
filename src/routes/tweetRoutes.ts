import { Router } from 'express';
import { createNewTweet } from '../controllers/tweetControllers';
import { uploadMoreThanOneMediaInPostMiddleware } from '../middleware/middlewares';
import likeRouter from './likeRouter';
import { isLoggedin, protect } from '../controllers/authControllers';

const tweetRouter = Router({ mergeParams: true });

// for merging it with other tweet actions resources
tweetRouter.use('/:tweetId/like', protect, likeRouter);

tweetRouter
  .route('/')
  .post(uploadMoreThanOneMediaInPostMiddleware, createNewTweet);

export default tweetRouter;
