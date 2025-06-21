import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { MeService } from './me.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('me')
export class MeController {

  constructor(private meService: MeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('organizations')
  getUserOrganizations(@Request() req) {
    return this.meService.getUserOrganizations(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('organizations/:id')
  getSingleOrganization(@Param('id') id: string) {
    return this.meService.getSingleOrganization(id)
  }
}
