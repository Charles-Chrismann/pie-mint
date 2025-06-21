import { Module } from '@nestjs/common';
import { SubEventsController } from './sub-events.controller';
import { SubEventsService } from './sub-events.service';

@Module({
  controllers: [SubEventsController],
  providers: [SubEventsService]
})
export class SubEventsModule {}
