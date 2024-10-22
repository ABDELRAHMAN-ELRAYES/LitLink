import { createClient } from 'redis';

const client = createClient();

export const setRedisData = async (
  key: string,
  expires: number,
  value: string
) => {
  await client.setEx(key, expires * 60, value);
};
export const getRedisData = async (key: string) => {
  const data = await client.get(key);
  return data;
};
export default client;
