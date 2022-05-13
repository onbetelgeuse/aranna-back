import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as Strategy from 'passport-keycloak-oauth2-oidc';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { KeycloakProfileDto } from '../user/dto/keycloak-profile.dto';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'Keycloak') {
  private readonly logger = new Logger(KeycloakStrategy.name);
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      authServerURL: config.get('keycloak.authServerURL'),
      realm: config.get('keycloak.realm'),
      clientID: config.get('keycloak.clientID'),
      clientSecret: config.get('keycloak.clientSecret'),
      callbackURL: config.get('keycloak.callbackURL'),
      publicClient: 'false',
    });
  }
  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: KeycloakProfileDto,
    done,
  ) {
    try {
      const user: UserDto = await this.authService.validateProfile(profile);
      done(null, user);
    } catch (error: any) {
      this.logger.error(error);
      done();
    }
  }
}
