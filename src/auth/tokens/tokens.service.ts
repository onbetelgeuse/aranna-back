import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';
import { AccessToken } from '../../entities/access-token.entity';
import { RefreshToken } from '../../entities/refresh-token.entity';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { AccessTokenRepository } from './repositories/access-token.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Injectable()
export class TokensService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async getAccessToken(
    user: UserDto,
    startDate: Date,
    entityManager: EntityManager,
  ): Promise<string> {
    const expiresIn: number = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRES_IN',
    );
    const token: AccessToken =
      await this.accessTokenRepository.createAccessToken(
        user,
        startDate,
        expiresIn,
        entityManager,
      );
    return this.jwtService.signAsync(
      {},
      {
        audience: this.configService.get('JWT_ACCESS_TOKEN_AUDIENCE'),
        issuer: this.configService.get('JWT_ACCESS_TOKEN_ISSUER'),
        algorithm: this.configService.get('JWT_ACCESS_TOKEN_ALGORITHM'),
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
        expiresIn,
        jwtid: token.id,
        subject: String(user.id),
      },
    );
  }
  public async getRefreshToken(
    user: UserDto,
    startDate: Date,
    entityManager: EntityManager,
  ): Promise<string> {
    const expiresIn: number = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    );
    const token: RefreshToken =
      await this.refreshTokenRepository.createAccessToken(
        user,
        startDate,
        expiresIn,
        entityManager,
      );
    return this.jwtService.signAsync(
      {},
      {
        audience: this.configService.get('JWT_REFRESH_TOKEN_AUDIENCE'),
        issuer: this.configService.get('JWT_REFRESH_TOKEN_ISSUER'),
        algorithm: this.configService.get('JWT_REFRESH_TOKEN_ALGORITHM'),
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
        expiresIn,
        jwtid: token.id,
        subject: String(user.id),
      },
    );
  }
}
