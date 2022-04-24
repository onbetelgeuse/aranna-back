import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UserDto } from './user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  public async register(@Body() user: CreateUserDto): Promise<UserDto> {
    return this.authService.register(user);
  }
}
