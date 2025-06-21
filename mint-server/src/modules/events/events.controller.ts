import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get(':eventId')
  getEventById(@Param('eventId') eventId: string) {
    return this.eventsService.getEventById(+eventId)
  }

  @Get(':eventId/sub-events')
  getEventSubEvents(@Param('eventId') eventId: string) {
    return this.eventsService.getEventSubEvents(+eventId)
  }
}
