import app from './app';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import client from './redis/redisStorage';
dotenv.config();

const port = process.env.PORT;

// connect redis storage 
client.on('error', (error) => {
  console.log('There is an error from Redis storage ..!',error);
});
client.connect().then(() => {
  console.log('[redis] Storage is connected successfully.');
});


// compilee sass files
function compileSass() {
  execSync(`sass src/styles/main.scss src/public/css/main.css`);
}
compileSass();

app.listen(port, () => {
  console.log(`[server] is listening at port ${port}`);
});
