import { Body, Controller, Get, Header, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SignatureGuard } from './guards/signature.gaurds';
import { RegisterRaceDTO } from './dto/race.dto';
import Redis from './Redis';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Post('races')
  @UseGuards(SignatureGuard)
  async registerRace(
    @Body() body: RegisterRaceDTO
  ) {
    return this.appService.registerRace(body)
  }

  @Get('races')
  async getRaces() {
    return this.appService.getRaces()
  }

  @Get('races/emulate')
  async generateRace(
    @Query('runnerCount') runnerCount: string
  ) {
    return this.appService.emulate({ runnerCount })
  }

  @Get('races/running')
  getRunningRaces() {
    return this.appService.getRunningRaces()
  }

  @Get('races/emulating')
  getEmulatingRaces() {
    return this.appService.getEmulatingRaces()
  }

  @Get('races/ended')
  getEndedRaces() {
    return this.appService.getEndedRaces()
  }

  @Get('races/:raceId/ranking')
  getRaceRanking(
    @Param('raceId') raceId: string
  ) {
    return this.appService.getRaceRanking(raceId)
  }

  @Get('races/:raceId/prune')
  pruneRace(
    @Param('raceId') raceId: string
  ) {
    return this.appService.pruneRace(raceId)
  }

  @Get('races/:raceId/user/:userId')
  @Header('Content-Type', 'application/gpx+xml')
  @Header('Content-Disposition', 'attachment; filename="race.gpx"')
  getUserIdGpx(
    @Param('raceId') raceId: string,
    @Param('userId') userId: string,
  ) {
    return this.appService.exportRaceUserGPX(userId, raceId)
  }
}
