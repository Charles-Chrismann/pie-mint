import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubEventsService } from './sub-events.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubEvent } from './entities/sub-event.entity';
import { CreateSubEventDto } from './dto/sub-event.dto';
import { getSubEventTrack } from '../../utils';

@ApiTags('SubEvents')
@Controller('sub-events')
export class SubEventsController {

  constructor(private subEventsService: SubEventsService) { }

  @Get(':subEventId')
  getSubEventById(@Param('subEventId') subEventId: string) {
    return this.subEventsService.getSubEventById(+subEventId)
  }

  // @UseInterceptors(FileInterceptor('file'))
  @Post()
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({
    status: 201,
    description: 'Create a SubEvent',
    type: SubEvent
  })
  async createSubEvent(
    @Body() createCatDto: CreateSubEventDto,
    @UploadedFile() file: Express.Multer.File
  )
  : Promise<SubEvent> 
  {
    return this.subEventsService.createSubEvent(createCatDto)
  }

  // @Get()
  // @ApiResponse({
  //   status: 200,
  //   description: 'All SubEvents',
  //   type: SubEvent,
  //   isArray: true,
  // })
  // getAllSubEvents(): Promise<SubEvent[]> {
  //   return this.subEventsService.getAllSubEvents()
  // }

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
}
