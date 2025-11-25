import { Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JWTPayload, PositionPayload, Race } from './declarations';
import Redis from './Redis';
import { encodePosition } from './seed/utils';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(AppGateway.name);
  lastSecondEvents: any[] = []
  emitTimeout: NodeJS.Timeout | null = null
  rankingEmitTimeout: NodeJS.Timeout

  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async startEventSending() {
    this.emitTimeout = setInterval(() => {
      if(!this.lastSecondEvents.length) return

      this.server.to('specs')
      .emit('positions', [...this.lastSecondEvents].sort((ra, rb) => rb.rank - ra.rank).map((r, i)=> ({ ...r, rank: i + 1 })))
      this.lastSecondEvents = []
    }, 1000)
  }

  handleConnection(socket: Socket): void {
    if(!this.emitTimeout) this.startEventSending()
  }

  handleDisconnect(client: any) {
    if(this.server.engine.clientsCount === 0) {
      clearInterval(this.emitTimeout!)
      this.emitTimeout = null
    }
  }

  afterInit(server: Server) {
    server.use((socket, next) => {
      
      socket.join('specs')
      
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
    const raceId = data.raceId

    const race = await Redis.hgetall(`race:${raceId}`);
    if(!race) return

    const startDate = new Date(race.startDate)
    const endDate = new Date(race.endDate)
    const currentDate = new Date()
    if(currentDate < startDate || currentDate >= endDate) return


    const userId = client.data.user.userId
    const isMember = await Redis.sismember(`race:${raceId}:users`, userId);
    if(!isMember) return

    const timestamp = Date.now()
    // TODO: remove negligeable position digits

    await Redis.zadd(`race:${race.id}:user:${userId}:position:${timestamp}`,
      timestamp,
      encodePosition([
        timestamp,
        data.position.lon,
        data.position.lat,
        data.position.alt
      ])
    )

    this.lastSecondEvents.push({
      userId,
      lon: data.position.lon,
      lat: data.position.lat,
      alt: data.position.alt,
    })
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
