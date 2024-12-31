export interface IUser {
  id: string;
  role: string;
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  profileCover: string;
  bio: string;
  joinedDate: Date;
  phoneNumber?: string;
  birthDate?: Date;
  address?: string;
  isVerified?: string;
}
