import { RefreshTokenRepository } from './refresh-token.repository';

describe('RefreshTokenRepository', () => {
  it('should be defined', () => {
    expect(new RefreshTokenRepository()).toBeDefined();
  });
});
