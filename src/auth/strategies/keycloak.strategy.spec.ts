import { KeycloakStrategy } from './keycloak.strategy';

describe('KeycloakStrategy', () => {
  it('should be defined', () => {
    expect(new KeycloakStrategy()).toBeDefined();
  });
});
