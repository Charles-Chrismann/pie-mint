import { Module } from '@nestjs/common';
import { StandardDistancesController } from './standard-distances.controller';
import { StandardDistancesService } from './standard-distances.service';

@Module({
  controllers: [StandardDistancesController],
  providers: [StandardDistancesService]
})
export class StandardDistancesModule {}
