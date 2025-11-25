import { Body, Controller, Get, Header, Param, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SignatureGuard } from './guards/signature.gaurds';
import { registerRaceDTO } from './dto/race.dto';
import Redis from './Redis';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Post('race')
  @UseGuards(SignatureGuard)
  async registerRace(
    @Body() body: registerRaceDTO
  ) {
    console.log(body)
    await Redis.registerRace(body)
  }

  @Get('race/running')
  getRunningRaces() {
    return this.appService.getRunningRaces()
  }

  @Get('race/:raceId/user/:userId')
  @Header('Content-Type', 'application/gpx+xml')
  @Header('Content-Disposition', 'attachment; filename="race.gpx"')
  getUserIdGpx(
    @Param('raceId') raceId: string,
    @Param('userId') userId: string,
  ) {
    return this.appService.exportRaceUserGPX(userId, raceId)
  }
}
