import { Router } from 'express';
import { createNewTweet } from '../controllers/postControllers';
import { uploadMoreThanOneMediaInPostMiddleware } from '../middleware/middlewares';

const postRouter = Router({ mergeParams: true });

postRouter
  .route('/')
  .post(uploadMoreThanOneMediaInPostMiddleware, createNewTweet);

export default postRouter;
