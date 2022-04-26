import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user';
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

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(@Req() req: RequestWithUser): Promise<UserDto> {
    return req.user;
  }
}
