export interface IGoogleUser {
  id: string;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
}
