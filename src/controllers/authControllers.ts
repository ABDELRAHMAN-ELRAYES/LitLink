import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ErrorHandler } from '../utils/ErrorHandler';
import { hash, compare } from '../utils/SecurityUtils';
import { transporter, emailOptions, sendEmail } from '../utils/Email';
import client, { getRedisData, setRedisData } from '../redis/redisStorage';
import randomatic from 'randomatic';
import { IToken } from '../interface/IVerifyToken';
import { IUser } from '../interface/IUser';

// import {uuid4} from 'uuid';
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
// check data before send verification code
export const dataChecker = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      birthDate: req.body.birthDate,
      phoneNumber: req.body.phoneNumber,
      profilePicture: req.file?.filename || 'default-user.png',
    };
    // if (data.username.includes(' ')) {
    //   return next(
    //     new ErrorHandler(400, 'Username should not contain any spaces.')
    //   );
    // }

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

    // store user registration data in redis storage
    const userDataKey = `signup-${data.email}`;
    const redisStorageExpiration = 15;
    const userData = JSON.stringify(data);
    await setRedisData(userDataKey, redisStorageExpiration, userData);

    // send verification code to user email and then pass data to signup controller
    // const verificationCode = uuid4();
    const verificationCode = await randomatic('0', 6);

    // modify the body of the email
    emailOptions.subject = 'LitLink | Sign up Verification Code ✔';
    emailOptions.to = data.email;
    emailOptions.text = `use this code to verify your registration email (without any spaces): ${verificationCode}`;
    emailOptions.html = `<p>use this code to verify your registration email (without any spaces): ${verificationCode}</p>`;

    // send email with verification code
    await sendEmail(transporter, emailOptions);

    // response with email to use it as a redis key
    res.status(200).json({
      email: data.email,
      verifiedCode: verificationCode,
    });
  }
);

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, enteredCode, verifiedCode } = req.body;
    if (enteredCode !== verifiedCode) {
      return next(new ErrorHandler(400, 'Verification code is not correct'));
    }
    const redisKey = `signup-${email}`;
    const userData = await getRedisData(redisKey);
    const data = userData ? JSON.parse(userData) : '';

    // delete user data from redis
    await client.del(redisKey);

    // create new user in database
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
    const user = req.user as any;

    if (!user) return next();
    const token = await generateToken(res, 'twitter user');
    res.status(200).json({
      token,
      user,
    });
  }
);
// check if the password is changed after the token signed
const checkIfPasswordChangedAfterToken = (
  userPasswordDate: number,
  tokenDate: number
) => userPasswordDate < tokenDate;

// check if the user login and have authentication or not
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if there is a jwt in cookie
    if (!req.cookies.jwt) {
      return next(
        new ErrorHandler(401, 'You are not login, Login and Try Again')
      );
    }
    const token = req.cookies.jwt;

    //verify current token
    const decoded = await jwt.verify(token, process.env.JWT as string);
    const userId = (decoded as IToken).id;

    // check if there is a  user with user id
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return next(
        new ErrorHandler(401, 'User with the current token is nolonger found!.')
      );
    }
    // check if the password is changed after token added
    const userChangedPasswordAt = new Date(user.resetPasswordUpdatedAt);
    const userChangedPasswordAtAsNumber = Math.floor(
      userChangedPasswordAt.getTime() / 1000
    );
    if (
      !checkIfPasswordChangedAfterToken(
        userChangedPasswordAtAsNumber,
        (decoded as IToken).iat
      )
    ) {
      return next(
        new ErrorHandler(
          401,
          'Password is changed, session time out, Please Login Again!.'
        )
      );
    }
    // store user in request to be accessible
    req.user = user;

    next();
    // res.status(200).json({
    //   decoded,
    //   userId,
    //   user: (req.user as IUser).id,
    // });
  }
);

export const isLoggedin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check if there is a jwt in cookie
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      //verify current token
      const decoded = await jwt.verify(token, process.env.JWT as string);
      if (!decoded) {
        return next();
      }

      const userId = (decoded as IToken).id;

      // check if there is a  user with user id
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return next();
      }
      // check if the password is changed after token added
      const userChangedPasswordAt = new Date(user.resetPasswordUpdatedAt);
      const userChangedPasswordAtAsNumber = Math.floor(
        userChangedPasswordAt.getTime() / 1000
      );
      if (
        !checkIfPasswordChangedAfterToken(
          userChangedPasswordAtAsNumber,
          (decoded as IToken).iat
        )
      ) {
        return next();
      }
      // store user in request to be accessible
      res.locals.user = user;
    } catch (error) {
      return next();
    }
  }
  next();
};
// check if the user authorized to do something
export const restrictTo = (...role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!role.includes((req.user as IUser).role)) {
      return next(
        new ErrorHandler(
          403,
          'You do not have permission to perform this action'
        )
      );
    }
    next();
  };
};

export const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
