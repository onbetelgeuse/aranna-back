import { anything, instance, mock, verify } from 'ts-mockito';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './user/dto/register-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    authService = mock(AuthService);
    controller = new AuthController(instance(authService));
  });

  it('1) should be defined', () => {
    // verify
    expect(controller).toBeDefined();
  });
  it('2) should register', async () => {
    // prepare
    const user: RegisterUserDto = {} as RegisterUserDto;
    // execute
    await controller.register(user);
    // verify
    verify(authService.register(anything())).once();
  });
});
