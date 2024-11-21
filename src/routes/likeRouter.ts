import { Router } from 'express';
import { likeATweet, unlikeATweet } from '../controllers/tweetControllers';

const likeRouter = Router({ mergeParams: true });

likeRouter.route('/').post(likeATweet).delete(unlikeATweet);

export default likeRouter;
