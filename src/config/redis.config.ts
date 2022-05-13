import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  role: process.env.REDIS_ROLE,
  password: process.env.REDIS_PASSWORD,
}));
