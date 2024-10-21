import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ErrorHandler } from '../utils/ErrorHandler';
import { hash, compare } from '../utils/SecurityUtils';

const prisma = new PrismaClient();

// generate a jwt for authentication
const generateToken = async (res: Response, id: string) => {
  const jwtSecret = process.env.JWT as string;
  const token = await jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
  };
  res.cookie('jwt', token, cookieOptions);
  return token;
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const data = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      birthDate: new Date(req.body.birthDate),
    };
    if (data.username.includes(' ')) {
      return next(new ErrorHandler(400, 'Username should not contain any spaces.'));
    }
    // check if the entered username from the user is found for another user
    const checkUsername = await prisma.user.findFirst({
      where: {
        username: data.username,
      },
    });
    if (checkUsername) {
      return next(new ErrorHandler(400, 'Username is already taken!.'));
    }
    // check if the entered email is found for another user

    const checkEmail = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (checkEmail) {
      return next(new ErrorHandler(400, 'Email is already taken!.'));
    }

    // check if the  user input the username or email with the password
    if (
      (!data.email && !data.username) ||
      (!data.password && !req.body.confirmPassword)
    )
      return next(
        new ErrorHandler(400, 'Please fill all fields then try Again...!.')
      );
    // check if there is a match between password and confirm password
    if (data.password !== req.body.confirmPassword) {
      return next(
        new ErrorHandler(400, 'Password and Confirm Password do not match!.')
      );
    }

    // hashing password before storing it in DataBase
    data.password = await hash(req.body.password);

    const user = await prisma.user.create({ data: data });
    // generate token with user id
    const token = await generateToken(res, user.id);

    res.status(200).json({
      status: 'you are logged in successfully!.',
      token,
      user,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get user data from body to authenticate using it
    // const email = req.body.email;
    const usernameOrEmail = req.body.username;
    const password = req.body.password;

    // check if the user input the username or email with the password
    if (!usernameOrEmail || !password)
      return next(
        new ErrorHandler(400, 'Please fill all fields then try Again...!.')
      );
    // find user if registered or not
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      },
    });
    if (!user)
      return next(
        new ErrorHandler(
          404,
          'Email, Username or Password are not correct..!, Try Again!.'
        )
      );
    // check if the password is correct or not
    const verifyPassword = await compare(password, user.password);
    if (!verifyPassword)
      return next(
        new ErrorHandler(
          401,
          'Email, Username or Password are not correct..!., Try Again!.'
        )
      );
    // generate token with user id
    const token = await generateToken(res, user.id);

    res.status(200).json({
      status: 'you are logged in successfully!.',
      token,
    });
  }
);
export const loginWithGoogle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('From here ---->');
    console.log(process.env.X_CLIENT_ID);
    console.log(process.env.X_CLIENT_SECRET);
    console.log(process.env.X_CALLBACK);

    const user = req.user as any;

    if (!user) return next();
    const token = await generateToken(res, 'twitter user');
    res.status(200).json({
      token,
      user,
    });
  }
);
export const loginWithTwitter = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(process.env.X_CLIENT_ID);
    console.log(process.env.X_CLIENT_SECRET);
    console.log(process.env.X_CALLBACK);

    const user = req.user as any;

    if (!user) return next();
    const token = await generateToken(res, 'twitter user');
    res.status(200).json({
      token,
      user,
    });
  }
);
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const isLoggedin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const restrictTo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
