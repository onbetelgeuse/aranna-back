import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecurityPasswordService } from './security-password.service';

@Module({
  imports: [ConfigModule],
  providers: [SecurityPasswordService],
  exports: [SecurityPasswordService],
})
export class SecurityModule {}
