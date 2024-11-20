import server from './app';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import redisClient from './redis/redisStorage';
// import redisClient from './redis/redis';

dotenv.config();

const port = process.env.PORT;

// connect redis storage
redisClient.on('error', (error) => {
  console.log('There is an error from Redis storage ..!', error);
});
redisClient.connect().then(() => {
  console.log('[redis] Storage is connected successfully.');
});

// compilee sass files
function compileSass() {
  execSync(`sass src/styles/main.scss src/public/css/main.css`);
}
compileSass();

server.listen(port, () => {
  console.log(`[server] is listening at port ${port}`);
});
