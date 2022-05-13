import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SecurityModule } from './security/security.module';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { TokensModule } from './tokens/tokens.module';
import { CommonModule } from '../common/common.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RolesGuard } from './guards/roles.guard';
import { KeycloakOAuthGuard } from './guards/keycloak-oauth.guard';
import { KeycloakStrategy } from './strategies/keycloak.strategy';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    UserModule,
    SecurityModule,
    TokensModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthGuard,
    LocalStrategy,
    JwtAuthGuard,
    JwtStrategy,
    JwtRefreshAuthGuard,
    JwtRefreshStrategy,
    RolesGuard,
    KeycloakOAuthGuard,
    KeycloakStrategy,
    UnauthorizedExceptionFilter,
  ],
})
export class AuthModule {}
