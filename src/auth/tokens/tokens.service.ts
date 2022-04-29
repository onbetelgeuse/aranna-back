import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from '../../entities/access-token.entity';
import { RefreshToken } from '../../entities/refresh-token.entity';
import { JwtPayload } from '../interfaces/jwt-payload';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { AccessTokenRepository } from './repositories/access-token.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { readFileSync } from 'fs';

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
    accessTokenRepository: AccessTokenRepository = this.accessTokenRepository,
  ): Promise<string> {
    const expiresIn: number = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRES_IN',
    );
    const token: AccessToken = await accessTokenRepository.createAccessToken(
      user,
      startDate,
      expiresIn,
    );
    return this.jwtService.signAsync(
      {},
      {
        audience: this.configService.get('JWT_ACCESS_TOKEN_AUDIENCE'),
        issuer: this.configService.get('JWT_ACCESS_TOKEN_ISSUER'),
        algorithm: this.configService.get('JWT_ACCESS_TOKEN_ALGORITHM'),
        expiresIn,
        jwtid: token.id,
        subject: String(user.id),
        privateKey: readFileSync(`${process.cwd()}/keys/jwtRS256.key`),
      },
    );
  }
  public async getRefreshToken(
    user: UserDto,
    startDate: Date,
    refreshTokenRepository: RefreshTokenRepository = this
      .refreshTokenRepository,
  ): Promise<string> {
    const expiresIn: number = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    );
    const token: RefreshToken = await refreshTokenRepository.createAccessToken(
      user,
      startDate,
      expiresIn,
    );
    return this.jwtService.signAsync(
      {},
      {
        audience: this.configService.get('JWT_REFRESH_TOKEN_AUDIENCE'),
        issuer: this.configService.get('JWT_REFRESH_TOKEN_ISSUER'),
        algorithm: this.configService.get('JWT_REFRESH_TOKEN_ALGORITHM'),
        privateKey: readFileSync(`${process.cwd()}/keys/jwtRS256.key`),
        expiresIn,
        jwtid: token.id,
        subject: String(user.id),
      },
    );
  }

  public async validateAccessToken(
    accessToken: string,
    payload: JwtPayload,
  ): Promise<UserDto> {
    if (!accessToken) {
      throw new UnauthorizedException('Access token is not set.');
    }
    accessToken = accessToken.split(/bearer /i).pop();
    if (!accessToken) {
      throw new UnauthorizedException('access token is not valid.');
    }
    const token: AccessToken = await this.getStoredTokenFromAccessTokenPayload(
      payload,
    );
    if (!token) {
      throw new UnauthorizedException('Access token is not found.');
    }
    if (token.revoked) {
      throw new UnauthorizedException('Access token is revoked.');
    }
    const user: UserDto = await this.getUserFromAccessTokenPayload(payload);
    if (!user) {
      throw new UnauthorizedException('User is not found.');
    }
    if (!user.enabled) {
      throw new UnauthorizedException('User is desactivated.');
    }
    if (user.id !== token.userId) {
      throw new UnauthorizedException('Token mismatch.');
    }
    return user;
  }
  private async getStoredTokenFromAccessTokenPayload(
    payload: JwtPayload,
  ): Promise<AccessToken> {
    const tokenId: string = payload.jti;
    if (!tokenId) {
      throw new UnauthorizedException('Access token is not valid.');
    }
    return this.accessTokenRepository.findOne(tokenId);
  }

  private async getUserFromAccessTokenPayload(
    payload: JwtPayload,
  ): Promise<UserDto> {
    if (payload) {
      const userId: number = +payload.sub;
      if (isNaN(userId)) {
        throw new UnauthorizedException('Access token is not valid.');
      }
      return this.usersService.findById(userId);
    }
  }
}
