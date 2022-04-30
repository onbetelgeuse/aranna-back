import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AccessTokenRepository } from './repositories/access-token.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    UserModule,
    TypeOrmModule.forFeature([AccessTokenRepository, RefreshTokenRepository]),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
