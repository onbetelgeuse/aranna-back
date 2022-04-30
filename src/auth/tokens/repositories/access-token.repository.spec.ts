import { AccessTokenRepository } from './access-token.repository';

describe('AccessTokenRepository', () => {
  it('should be defined', () => {
    expect(new AccessTokenRepository()).toBeDefined();
  });
});
