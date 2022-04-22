import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [UserModule, SecurityModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
