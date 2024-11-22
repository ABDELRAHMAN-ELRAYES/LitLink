import { Router } from 'express';
import { protect } from '../controllers/authControllers';
import {
  bookmarkTweet,
  removeBookmarkedTweet,
} from '../controllers/bookmarkControllers';

const bookmarkRouter = Router({ mergeParams: true });

bookmarkRouter.use(protect);
bookmarkRouter
  .route('/:bookmarkId')
  .post(bookmarkTweet)
  .delete(removeBookmarkedTweet);

export default bookmarkRouter;
