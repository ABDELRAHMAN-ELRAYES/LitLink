import { createClient } from 'redis';

const redisClient = createClient();

export const setRedisData = async (
  key: string,
  expires: number,
  value: string
) => {
  await redisClient.setEx(key, expires * 60, value);
};
export const getRedisData = async (key: string) => {
  const data = await redisClient.get(key);
  return data;
};
export default redisClient;
