import { Controller, Post, UseGuards, Request, Body, Query, Get, HttpCode } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto, EmailExistDto, LoginDto } from './dto/auth.dto';
import { CurrentUser } from './current-user.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import {
  EmailExistResponse,
  UserLoginResponse,
  UserRegisterResponse
} from './entities/auth.entity';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @ApiOperation({ summary: 'Check if an email is used' })
  @ApiResponse({
    status: 200,
    description: 'Check if an email is used',
    type: EmailExistResponse
  })
  @Get('email-exists')
  async checkEmailExists(
    @Query() query: EmailExistDto
  ): Promise<EmailExistResponse> {
    return this.authService.isEmailTaken(query.email);
  }

  @ApiOperation({ summary: 'Create an email/password account' })
  @ApiResponse({
    status: 201,
    description: 'Create an email/password account',
    type: UserRegisterResponse
  })
  @HttpCode(201)
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserRegisterResponse> {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Login with email/password' })
  @ApiResponse({
    status: 200,
    description: 'Login with email/password',
    type: UserLoginResponse
  })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(
    @CurrentUser() user: any
  ): Promise<UserLoginResponse> {
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @ApiOperation({ summary: 'Protected route requiring Authorization header' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Use the refresh_token sent on login as a bearer',
    required: true,
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @CurrentUser() user: any
  ) {
    return this.authService.login(user);
  }
}
