import { generateFromEmail } from 'unique-username-generator';

export const generateUniqueUsernameFromEmail = (email: string) =>
  generateFromEmail(email, 4);
