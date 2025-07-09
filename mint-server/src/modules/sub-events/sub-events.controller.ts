import { Body, Controller, Get, Param, ParseArrayPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubEventsService } from './sub-events.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubEvent } from './entities/sub-event.entity';
import { AddRunnerToSubEventDto, CreateSubEventDto, CreateSubEventWithFileDto, GetSubEventsAroundQueryDto, UpdateSubEventDto, UpdateSubEventWithFileDto } from './dto/sub-event.dto';
import { getSubEventTrack } from '../../utils';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JWTUser } from 'src/declaration';

@ApiTags('SubEvents')
@Controller('sub-events')
export class SubEventsController {

  constructor(private subEventsService: SubEventsService) { }

  @ApiOperation({ summary: 'Create a subEvent (a race)' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSubEventWithFileDto })
  @ApiResponse({
    status: 201,
    description: 'The created subEvent (or race)',
    type: SubEvent
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createSubEvent(
    @CurrentUser() user: JWTUser,
    @Body() createSubEventDto: CreateSubEventDto,
    @UploadedFile('file') file: Express.Multer.File
  )
    : Promise<SubEvent> {
    return this.subEventsService.createSubEvent(user, createSubEventDto, file)
  }

  @ApiOperation({ summary: 'Update a subEvent (a race)' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: 'The created subEvent (or race)',
    type: SubEvent
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateSubEvent(
    @CurrentUser() user: JWTUser,
    @Body() updateSubEventDto: UpdateSubEventDto,
    @UploadedFile('file') file: Express.Multer.File,
    @Param('id') id: string,
  )
    : Promise<any> {
    return this.subEventsService.updateSubEvent(+id, user, updateSubEventDto)
  }

  // @Get(':id')
  // @ApiResponse({
  //   status: 200,
  //   description: 'The corresponding SubEvent',
  //   type: SubEvent
  // })
  // async getSubEventById(@Param('id') id: string): Promise<SubEvent> {
  //   return { name: "a" }
  // }

  @Get(':subEventId/track')
  getSubEventTrack(@Param('subEventId') subEventId: number) {
    return getSubEventTrack(subEventId)
  }

  @Get(':subEventId/runners')
  getSubEventRunner(
    @Param('subEventId') subEventId: string
  ) {
    return this.subEventsService.getSubEventRunners(+subEventId)
  }

  @ApiOperation({ summary: 'Add runners to race' })
  @ApiBearerAuth('access-token')
  @ApiBody({
    type: AddRunnerToSubEventDto,
    isArray: true
  })
  @UseGuards(JwtAuthGuard)
  @Post(':subEventId/add-runners')
  addRunnerToSubEvent(
    @CurrentUser() user: JWTUser,
    @Param('subEventId') subEventId: string,
    @Body(new ParseArrayPipe({ items: AddRunnerToSubEventDto })) AddRunnerToSubEventDto: AddRunnerToSubEventDto[]
  ) {
    return this.subEventsService.addRunnerToSubEvent(user.userId, +subEventId, AddRunnerToSubEventDto)
  }

  @ApiOperation({ summary: 'Find races around a position' })
  @ApiResponse({
    status: 200,
    description: 'The races around',
    type: SubEvent,
    isArray: true
  })
  @Get('around-me')
  getSubEventAround(
    @Query() query: GetSubEventsAroundQueryDto
  ) {
    return this.subEventsService.getSubEventsAround(query)
  }

  @Get(':subEventId')
  getSubEventById(@Param('subEventId') subEventId: string) {
    return this.subEventsService.getSubEventById(+subEventId)
  }

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'All SubEvents',
    type: SubEvent,
    isArray: true,
  })
  getAllSubEvents(): Promise<SubEvent[]> {
    return this.subEventsService.getAllSubEvents()
  }
}
