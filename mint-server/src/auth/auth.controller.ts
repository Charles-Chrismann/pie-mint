import { Controller, Post, UseGuards, Request, Body, Query, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/auth.dto';
import { CurrentUser } from './current-user.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Get('email-exists')
  async checkEmailExists(@Query('email') email: string) {
    return this.authService.isEmailTaken(email);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: any
  ) {
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @CurrentUser() user: any
  ) {
    return this.authService.login(user);
  }
}
