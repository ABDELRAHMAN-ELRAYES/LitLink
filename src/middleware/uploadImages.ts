import multer, { diskStorage, FileFilterCallback } from 'multer';
import path from 'path';
import { IUser } from '../interface/IUser';
import { Request } from 'express';
import { ErrorHandler } from '../utils/ErrorHandler';

export const uploadImage = (folderName: string, fieldName: string) => {
  const multerDiskStorage = diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../public/img/${folderName}`));
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `${(req.user as IUser)?.id || `registered-user`}-${Date.now()}.${
          file.mimetype.split('/')[1]
        }`
      );
    },
  });
  const multerFilterCallback = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(
        new ErrorHandler(
          400,
          'This is not an image, Choose a Proper image!. '
        ) as any,
        false
      );
    }
  };

  const upload = multer({
    storage: multerDiskStorage,
    fileFilter: multerFilterCallback,
  });
  return upload.array(fieldName, 5);
};
