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
  login,
  protect,
  signup,
} from '../controllers/authControllers';
import { uploadUserImageMiddleware } from '../middleware/middlewares';
const userRouter = Router();

userRouter.post('/test', protect);

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/verify', uploadUserImageMiddleware, dataChecker);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default userRouter;
