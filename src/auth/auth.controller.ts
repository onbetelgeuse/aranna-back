import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authorize } from './decorators/authorize.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginResponse } from './interfaces/login-response';
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
  public async login(@Req() req: RequestWithUser): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  public async logout(@Req() req: RequestWithUser): Promise<void> {
    const accessToken: string = req.headers.authorization;
    const refreshToken: string = req.headers.refresh as string;
    return this.authService.logout(req.user, accessToken, refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Authorize()
  @Get('authorize')
  public async authorize(@Req() req: RequestWithUser): Promise<UserDto> {
    return req.user;
  }
}
