import { IUser } from './IUser';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
