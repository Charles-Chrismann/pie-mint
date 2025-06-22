import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return 'the users'
  }

  // @Get(':id')
  // getUser(@Param('id') id : string) {
  //   return `user ${id}`
  // }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getSelfProfile(@Request() req) {
    return req.user
  }
}
