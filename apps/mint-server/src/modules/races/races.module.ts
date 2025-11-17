import { Module } from '@nestjs/common';
import { RacesController } from './races.controller';
import { RacesService } from './races.service';

@Module({
  controllers: [RacesController],
  providers: [RacesService]
})
export class RaceModule {}
