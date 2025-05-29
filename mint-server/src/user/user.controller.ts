import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get()
  getUsers() {
    return 'the users'
  }


  @Get(':id')
  getUser(@Param('id') id : string) {
    return `user ${id}`
  }
}
