import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { readFileSync } from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { TokensService } from '../tokens/tokens.service';
import { UserDto } from '../user/dto/user.dto';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly tokensService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('refresh'),
      secretOrKey: readFileSync(`${process.cwd()}/keys/jwtRS256.key.pub`),
      issuer: config.get('JWT_REFRESH_TOKEN_ISSUER'),
      audience: config.get('JWT_REFRESH_TOKEN_AUDIENCE'),
      algorithms: config.get('JWT_REFRESH_TOKEN_ALGORITHM'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  public async validate(req: Request, payload: JwtPayload): Promise<UserDto> {
    return this.tokensService.validateRefreshToken(payload);
  }
}
