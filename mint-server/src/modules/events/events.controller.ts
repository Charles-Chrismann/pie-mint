import { Body, Controller, Get, HttpCode, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JWTUser } from 'src/declaration';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Event } from './entities/event.entity';
import { SubEvent } from '../sub-events/entities/sub-event.entity';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) { }

  @ApiOperation({ summary: 'Create an event' })
  @ApiResponse({
    status: 201,
    description: 'The created event',
    type: Event
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([]),
  )
  @HttpCode(201)
  @Post('')
  createEvent(
    @CurrentUser() user: JWTUser,
    @Body() body: CreateEventDto
  ): Promise<Event> {
    return this.eventsService.createEvent(user, body)
  }

  @ApiOperation({ summary: 'Get an event by its id' })
  @ApiResponse({
    status: 200,
    description: 'The event',
    type: Event
  })
  @Get(':eventId')
  getEventById(
    @Param('eventId') eventId: string
  ): Promise<Event> {
    return this.eventsService.getEventById(+eventId)
  }

  @ApiOperation({ summary: 'Get the sub events in an event' })
  @ApiResponse({
    status: 200,
    description: 'The array of sub events',
    isArray: true,
    type: SubEvent
  })
  @HttpCode(200)
  @Get(':eventId/sub-events')
  getEventSubEvents(
    @Param('eventId') eventId: string
  ) {
    return this.eventsService.getEventSubEvents(+eventId)
  }
}
