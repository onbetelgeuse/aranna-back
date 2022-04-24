import { registerAs } from '@nestjs/config';

export default registerAs('securitypassword', () => ({
  saltsize: process.env.SECURITY_PASSWORD_SALT_SIZE || 128,
  keysize: process.env.SECURITY_PASSWORD_KEY_SIZE || 512,
  iterations: process.env.SECURITY_PASSWORD_ITERATIONS || 2000,
  secretkey: process.env.SECURYTY_PASSWORD_SECRET_KEY,
}));
