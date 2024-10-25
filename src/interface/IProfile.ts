interface IEmail {
  value: string;
  verified: boolean;
}
interface IPhoto {
  value: string;
}
export interface IProfile {
  displayName: string;
  emails: IEmail[];
  photos: IPhoto[];
}
