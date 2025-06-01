import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSubEventDto } from 'src/dtos/sub-event.dto';
import { SubEventsService } from './sub-events.service';

@Controller('sub-events')
export class SubEventsController {

  constructor(private subEventsService: SubEventsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  CreateSubEvent(
    @Body() createSubEventDto: CreateSubEventDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log(createSubEventDto)
    console.log(file)
    return
  }

  @Get(':subEventId/track')
  getSubEventTrack(@Param('subEventId') subEventId: number) {
    return this.subEventsService.getSubEventTrack(subEventId)
  }
}
