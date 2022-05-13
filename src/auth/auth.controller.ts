import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authorize } from './decorators/authorize.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { KeycloakOAuthGuard } from './guards/keycloak-oauth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { RefreshResponse } from './interfaces/refresh-response';
import { RequestWithUser } from './interfaces/request-with-user';
import { RegisterUserDto } from './user/dto/register-user.dto';
import { UserDto } from './user/dto/user.dto';
import { Response } from 'express';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  public async register(@Body() user: RegisterUserDto): Promise<UserDto> {
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

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  public async refresh(@Req() req: RequestWithUser): Promise<RefreshResponse> {
    const refreshToken: string = req.headers.refresh as string;
    return this.authService.refresh(req.user, refreshToken);
  }

  @UseGuards(KeycloakOAuthGuard)
  @Get('external/login')
  public externalLogin(): void {}

  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(KeycloakOAuthGuard)
  @Get('external/callback')
  public async externalLoginCallback(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const response: LoginResponse = await this.authService.login(req.user);
      const data: string = Buffer.from(JSON.stringify(response)).toString(
        'base64url',
      );
      res.redirect(
        `${this.config.get('keycloak.successRedirectURL')}?response=${data}`,
      );
    } catch (error) {
      res.redirect(this.config.get('keycloak.successRedirectURL'));
    }
  }
}
