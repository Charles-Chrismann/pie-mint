import { Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JWTPayload, PositionPayload, Race } from './declarations';
import Redis from './Redis';
import { encodePosition } from './seed/utils';
import { AppService } from './app.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(AppGateway.name);
  emitTimeout: NodeJS.Timeout | null = null
  rankingEmitTimeout: NodeJS.Timeout

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private appService: AppService
  ) {}

  async startEventSending() {
    this.logger.verbose(`Start emitting`)
    this.emitTimeout = setInterval(() => {

      const emus = this.appService.emulatedRace
      if(emus.length) {
        for(const race of emus) {
          const raceId = race.id
          race.progress++
          const positions = race.getPositions(race.progress)
          for(const position of positions) {
            this.appService.handlePositionEvent(position.userId, { raceId, position: { lat: position.lat, lon: position.lon, alt: position.alt } })
          }
        }
      }

      if(!this.appService.lastSecondEvents.length) return

      this.server.to('specs')
      // .emit('positions', [...this.lastSecondEvents].sort((ra, rb) => rb.rank - ra.rank).map((r, i)=> ({ ...r, rank: i + 1 })))
      .emit('positions', [...this.appService.lastSecondEvents])
      this.appService.lastSecondEvents = []
    }, 1000)
  }

  handleConnection(socket: Socket): void {
    if(!this.emitTimeout) this.startEventSending()
  }

  handleDisconnect(client: any) {
    if(this.server.engine.clientsCount === 0) {
      this.logger.verbose(`Stop emitting`)
      clearInterval(this.emitTimeout!)
      this.emitTimeout = null
    }
  }

  afterInit(server: Server) {
    server.use((socket, next) => {
      
      // socket.join('specs')
      
      const token = socket.handshake.auth.token || socket.handshake.headers.token;
      if(token) {
        try {
          const payload: JWTPayload = this.jwtService.verify(token);
          socket.data.user = payload;
          socket.join('runners')
          this.logger.verbose(`Runner #${payload.userId} connected!`)
          next();
        } catch (err) {
          console.log('Token not verified', err)
          next(new Error('Unauthorized'));
        }
      } else {
        this.logger.verbose('Spectator connected')
        socket.join('specs')
        next();
      }
    });
  }

  @SubscribeMessage('position')
  // TODO: add JWT guard
  async storePosition(
    client: Socket,
    data: PositionPayload
  ) {
    return this.appService.handlePositionEvent(client.data.user.userId, data)
  }

  // positions: any[] = []

  // @WebSocketServer()
  // server: Server;

  // count = 0
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any) {
  //   this.count++

  //   if(this.count % 100 === 0) console.log(this.count)
  //   // console.log(payload)
  //   return;
  // }


  // @SubscribeMessage('position')
  // handlePosition(client: any, payload: any) {
  //   console.log('received position:', JSON.stringify(payload))
  //   this.lastSecondEvents.push(payload)
  //   // this.server.to('spec').emit('position', payload);
  // }

  // @SubscribeMessage('spec')
  // handleSpec(client: Socket, payload: any) {
  //   client.join('spec')
  // }
}
