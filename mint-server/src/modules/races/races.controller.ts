import { Body, Controller, Get, Param, ParseArrayPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RacesService } from './races.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NestedRace, NestedRegistrations, Race } from './entities/race.entity';
import {
  AddRunnerToRaceDto,
  CreateRaceDto,
  CreateRaceWithFileDto,
  GetRaceByIdParamDto,
  GetRacesAroundQueryDto,
  UpdateRaceDto,
  UpdateRaceWithFileDto
} from './dto/race.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JWTUser } from 'src/declaration';

@ApiTags('Races')
@Controller('races')
export class RacesController {

  constructor(private racesService: RacesService) { }

  @ApiOperation({ summary: 'Create a race' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateRaceWithFileDto })
  @ApiResponse({
    status: 201,
    description: 'The created race',
    type: Race
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createRace(
    @CurrentUser() user: JWTUser,
    @Body() createRaceDto: CreateRaceDto,
    @UploadedFile('file') file: Express.Multer.File
  )
    : Promise<any> {
    return this.racesService.createRace(user, createRaceDto, file)
  }

  @ApiOperation({ summary: 'Update a race' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: 'The created race',
    type: Race
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateRace(
    @CurrentUser() user: JWTUser,
    @Body() updateRaceDto: UpdateRaceDto,
    @UploadedFile('file') file: Express.Multer.File,
    @Param('id') id: string,
  )
    : Promise<any> {
    return this.racesService.updateRace(+id, user, updateRaceDto)
  }

  // @Get(':id')
  // @ApiResponse({
  //   status: 200,
  //   description: 'The corresponding Race',
  //   type: Race
  // })
  // async getRaceById(@Param('id') id: string): Promise<Race> {
  //   return { name: "a" }
  // }

  @Get(':raceId/track')
  getRaceTrack(@Param('raceId') raceId: number) {
    return this.racesService.getRaceTrack(raceId)
  }

  @Get(':raceId/runners')
  @ApiOperation({ summary: 'Get the registrations info of the runners in a race' })
  @ApiResponse({
    status: 200,
    description: 'The registration infos & the infos of the runners in the race',
    type: NestedRegistrations,
    isArray: true
  })
  getRaceRunner(
    @Param('raceId') raceId: string
  ) {
    return this.racesService.getRaceRunners(+raceId)
  }

  @ApiOperation({ summary: 'Add runners to race' })
  @ApiBearerAuth('access-token')
  @ApiBody({
    type: AddRunnerToRaceDto,
    isArray: true
  })
  @UseGuards(JwtAuthGuard)
  @Post(':raceId/add-runners')
  addRunnerToRace(
    @CurrentUser() user: JWTUser,
    @Param('raceId') raceId: string,
    @Body(new ParseArrayPipe({ items: AddRunnerToRaceDto })) AddRunnerToRaceDto: AddRunnerToRaceDto[]
  ) {
    return this.racesService.addRunnerToRace(user.userId, +raceId, AddRunnerToRaceDto)
  }

  @ApiOperation({ summary: 'Find races around a position' })
  @ApiResponse({
    status: 200,
    description: 'The races around',
    type: Race,
    isArray: true
  })
  @Get('around-me')
  getRaceAround(
    @Query() query: GetRacesAroundQueryDto
  ) {
    return this.racesService.getRacesAround(query)
  }

  @ApiOperation({ summary: 'Get race by id' })
  @ApiResponse({
    status: 200,
    description: 'The race infos',
    type: NestedRace,
  })
  @Get(':raceId')
  getRaceById(
    @Param() params: GetRaceByIdParamDto
  ) {
    return this.racesService.getRaceById(params.raceId)
  }

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'All Races',
    type: Race,
    isArray: true,
  })
  getAllRaces(): Promise<Race[]> {
    return this.racesService.getAllRaces()
  }
}
