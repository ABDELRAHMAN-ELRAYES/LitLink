import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userControllers';
import {
  dataChecker,
  isLoggedin,
  login,
  protect,
  signup,
} from '../controllers/authControllers';
import { uploadUserImageMiddleware } from '../middleware/middlewares';
import postRouter from './tweetRoutes';
const userRouter = Router();

userRouter.use('/tweet', protect, isLoggedin, postRouter);

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/verify', uploadUserImageMiddleware, dataChecker);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default userRouter;
