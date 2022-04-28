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

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    UserModule,
    SecurityModule,
    TokensModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthGuard, LocalStrategy],
})
export class AuthModule {}
