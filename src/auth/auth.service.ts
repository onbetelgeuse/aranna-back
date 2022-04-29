import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transaction, TransactionRepository } from 'typeorm';
import { DateService } from '../common/services/date.service';
import { LoginResponse } from './interfaces/login-response';
import { AccessTokenRepository } from './tokens/repositories/access-token.repository';
import { RefreshTokenRepository } from './tokens/repositories/refresh-token.repository';
import { TokensService } from './tokens/tokens.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UserDto } from './user/dto/user.dto';
import { UserService } from './user/user.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly dateService: DateService,
    private readonly userService: UserService,
    private readonly tokensService: TokensService,
  ) {}

  public async register(user: CreateUserDto): Promise<UserDto> {
    try {
      if (!user) {
        this.logger.error('User cannot be null or undefined.');
        throw new BadRequestException('User cannot be null or undefined.');
      }

      if (!user.email) {
        this.logger.error('User email cannot be null or undefined.');
        throw new BadRequestException(
          'User email cannot be null or undefined.',
        );
      }
      const existedUser: UserDto = await this.userService.findByEmail(
        user.email,
      );
      if (existedUser) {
        this.logger.error('User with the same email already exists.');
        throw new ConflictException('User with the same email already exists.');
      }
      if (user.external && user.password) {
        this.logger.error('External user should not have a password.');
        throw new BadRequestException(
          'External user should not have a password.',
        );
      }
      if (!user.external && !user.password) {
        this.logger.error('User password cannot be null or undefined.');
        throw new BadRequestException(
          'User password cannot be null or undefined.',
        );
      }
      return this.userService.createUser(user);
    } catch (error) {
      throw error;
    }
  }

  public async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserDto> {
    const user: UserDto = await this.userService.authenticate(email, password);
    if (!user) {
      throw new BadRequestException();
    }
    if (!user.enabled) {
      this.logger.warn('User is disabled.');
      throw new ForbiddenException('User is disabled.');
    }
    return user;
  }

  @Transaction()
  public async login(
    user: UserDto,
    @TransactionRepository()
    accessTokenRepo?: AccessTokenRepository,
    @TransactionRepository()
    refreshTokenRepo?: RefreshTokenRepository,
  ): Promise<LoginResponse> {
    const startDate: Date = this.dateService.getCurrent();
    const expiresIn: number = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRES_IN',
    );
    const [accessToken, refreshToken]: string[] = await Promise.all([
      this.tokensService.getAccessToken(user, startDate, accessTokenRepo),
      this.tokensService.getRefreshToken(user, startDate, refreshTokenRepo),
    ]);
    return {
      expiresIn,
      accessToken,
      refreshToken,
      user,
    };
  }
  @Transaction()
  public async logout(
    user: UserDto,
    accessToken: string,
    refreshToken: string,
    @TransactionRepository()
    accessTokenRepo?: AccessTokenRepository,
    @TransactionRepository()
    refreshTokenRepo?: RefreshTokenRepository,
  ): Promise<void> {
    await Promise.all([
      this.tokensService.removeAccessToken(user, accessToken, accessTokenRepo),
      this.tokensService.removeRefreshToken(
        user,
        refreshToken,
        refreshTokenRepo,
      ),
    ]);
  }
}
