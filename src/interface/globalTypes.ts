import { IUser } from './IUser';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}
