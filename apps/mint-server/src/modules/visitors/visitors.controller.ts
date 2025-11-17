import { Body, Controller, Get } from '@nestjs/common';
import { VisitorsService } from './visitors.service';

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Get()
  getVisitors() {
    return 'the visitors';
  }

  // @Get(':id')
  // getUser(@Param('id') id : string) {
  //   return `user ${id}`
  // }

  @Get('tracks')
  getSelfProfile(@Body() body) {
    return this.visitorsService.getVisitorTracks(body.code);
  }
}
