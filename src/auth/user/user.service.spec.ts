import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { User } from '../../entities/user.entity';
import { SecurityPasswordService } from '../security/security-password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let securityPasswordService: SecurityPasswordService;

  beforeEach(async () => {
    userRepository = mock(UserRepository);
    securityPasswordService = mock(SecurityPasswordService);

    service = new UserService(
      instance(userRepository),
      instance(securityPasswordService),
    );
  });

  it('1) should be defined', () => {
    // verify
    expect(service).toBeDefined();
  });

  it('2) should findByEmail', async () => {
    // prepare
    const email: string = 'email@domain';
    // execute
    await service.findByEmail(email);
    // verify
    verify(userRepository.findByEmail(email)).once();
  });

  it('3) should findByEmail with undefined email', async () => {
    // prepare
    const email: string = undefined;

    try {
      // execute
      await service.findByEmail(email);
    } catch (error: any) {
      // verify
      verify(userRepository.findByEmail(email)).never();
      expect(error?.status).toBe(400);
      expect(error?.name).toBe('BadRequestException');
      expect(error?.message).toBe('Email cannot be null or undefined.');
    }
  });

  it('4) should findById', async () => {
    // prepare
    const id: number = 1;
    // execute
    await service.findById(id);
    // verify
    verify(userRepository.findOne(id)).once();
  });

  it('5) should findById with undefined id', async () => {
    // prepare
    const id: number = undefined;

    try {
      // execute
      await service.findById(id);
    } catch (error: any) {
      // verify
      verify(userRepository.findOne(id)).never();
      expect(error?.status).toBe(400);
      expect(error?.name).toBe('BadRequestException');
      expect(error?.message).toBe('Id cannot be null or undefined.');
    }
  });

  it('6) should CreateUser', async () => {
    // prepare
    const user: CreateUserDto = {
      email: 'email',
      roles: ['USER'],
      firstName: 'firstname',
      lastName: 'lastName',
      enabled: true,
      external: false,
      password: 'secret',
    };
    when(securityPasswordService.generate(anything())).thenReturn({
      passwordHash: 'hash',
      passwordSalt: 'salt',
    });
    // execute
    await service.createUser(user);
    // verify
    verify(securityPasswordService.generate(user.password)).once();
    verify(userRepository.save(anything())).once();
    const [capturedUser]: User[] = capture<User>(userRepository.save).first();
    expect(capturedUser).toEqual({
      email: 'email',
      enabled: true,
      external: false,
      firstName: 'firstname',
      lastName: 'lastName',
      passwordHash: 'hash',
      passwordSalt: 'salt',
      roles: [
        {
          name: 'USER',
        },
      ],
    });
  });

  it('7) should CreateUser with external user', async () => {
    // prepare
    const user: CreateUserDto = {
      email: 'email',
      roles: ['USER'],
      firstName: 'firstname',
      lastName: 'lastName',
      enabled: true,
      external: true,
      password: undefined,
    };
    when(securityPasswordService.generate(anything())).thenReturn({
      passwordHash: 'hash',
      passwordSalt: 'salt',
    });
    // execute
    await service.createUser(user);
    // verify
    verify(securityPasswordService.generate(anything())).never();
    verify(userRepository.save(anything())).once();
    const [capturedUser]: User[] = capture<User>(userRepository.save).first();
    expect(capturedUser).toEqual({
      email: 'email',
      enabled: true,
      external: true,
      firstName: 'firstname',
      lastName: 'lastName',
      passwordHash: undefined,
      passwordSalt: undefined,
      roles: [
        {
          name: 'USER',
        },
      ],
    });
  });
  it('8) should CreateUser with undefined user', async () => {
    // prepare
    const user: CreateUserDto = undefined;
    when(securityPasswordService.generate(anything())).thenReturn({
      passwordHash: 'hash',
      passwordSalt: 'salt',
    });
    try {
      // execute
      await service.createUser(user);
      // verify
    } catch (error: any) {
      verify(securityPasswordService.generate(anything())).never();
      verify(userRepository.save(anything())).never();
      expect(error?.status).toBe(400);
      expect(error?.name).toBe('BadRequestException');
      expect(error?.message).toBe('User cannot be null or undefined.');
    }
  });
});
