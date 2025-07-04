import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return 'the users';
  }

  // @Get(':id')
  // getUser(@Param('id') id : string) {
  //   return `user ${id}`
  // }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getSelfProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/visitors')
  async getSelfVisitors(@Request() req) {
    const userId = req.user.userId;
    return await this.usersService.getVisitorsByUserId(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('me/visitors')
  async create(@Request() req) {
    const userId = req.user.userId;
    return (await this.usersService.createVisitorByUserId(userId))[0];
  }
}
