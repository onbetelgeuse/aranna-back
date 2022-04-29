import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from '../user/dto/user.dto';
import { Request } from 'express';
import { TokensService } from '../tokens/tokens.service';
import { JwtPayload } from '../interfaces/jwt-payload';
import { readFileSync } from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly tokensService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: readFileSync(`${process.cwd()}/keys/jwtRS256.key.pub`),
      issuer: config.get('JWT_ACCESS_TOKEN_ISSUER'),
      audience: config.get('JWT_ACCESS_TOKEN_AUDIENCE'),
      algorithms: config.get('JWT_ACCESS_TOKEN_ALGORITHM'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  public async validate(req: Request, payload: JwtPayload): Promise<UserDto> {
    const accessToken: string = req.headers.authorization;
    return this.tokensService.validateAccessToken(accessToken, payload);
  }
}
