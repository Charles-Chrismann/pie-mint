import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StandardDistancesService } from './standard-distances.service';
import { StandardDistance } from './entities/standard-distance.entity';

@ApiTags('StandardDistances')
@Controller('standard-distances')
export class StandardDistancesController {

  constructor(private standardDistancesService: StandardDistancesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all standards distances' })
  @ApiResponse({
    status: 201,
    description: 'Get all standards distances',
    isArray: true,
    type: StandardDistance
  })
  getStandardDistances(): Promise<StandardDistance[]> {
    return this.standardDistancesService.getStandardDistances()
  }
}
