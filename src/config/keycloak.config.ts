import { registerAs } from '@nestjs/config';
import { BASE_PATH } from '../main';

export default registerAs('keycloak', () => ({
  authServerURL: process.env.KEYCLOAK_AUTH_SERVER_URL,
  realm: process.env.KEYCLOAK_REALM,
  clientID: process.env.KEYCLOAK_CLIENT_ID,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  callbackURL: `/${BASE_PATH}/auth/${process.env.KEYCLOAK_CALLBACK_URL}`,
  failureRedirectURL: process.env.KEYCLOAK_FAILURE_REDIRECT_URL,
  successRedirectURL: process.env.KEYCLOAK_SUCCESS_REDIRECT_URL,
}));
