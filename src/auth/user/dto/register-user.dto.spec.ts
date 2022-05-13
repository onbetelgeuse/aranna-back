import { RegisterUserDto } from './register-user.dto';

describe('CreateUserDto', () => {
  it('should be defined', () => {
    expect(new RegisterUserDto()).toBeDefined();
  });
});
