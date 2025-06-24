import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JWTUser } from 'src/declaration';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor([]),
  )
  createEvent(
    @CurrentUser() user: JWTUser,
    @Body() body: CreateEventDto
  ) {
    return this.eventsService.createEvent(user, body)
  }

  @Get(':eventId')
  getEventById(@Param('eventId') eventId: string) {
    return this.eventsService.getEventById(+eventId)
  }

  @Get(':eventId/sub-events')
  getEventSubEvents(@Param('eventId') eventId: string) {
    return this.eventsService.getEventSubEvents(+eventId)
  }
}
