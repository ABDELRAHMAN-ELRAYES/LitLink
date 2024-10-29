import { createClient } from 'redis';

const redisClient = createClient({
  password: process.env.REDIS_CLOUD_PASSWORD as string,
  socket: {
    host: process.env.REDIS_CLOUD_HOST as string,
    port: parseInt(process.env.REDIS_CLOUD_PORT as string, 10),
  },
});
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
