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


  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private appService: AppService
  ) {}

  handleConnection(socket: Socket): void {
    if(!this.appService.emitTimeout) this.appService.startEventSending()
  }

  handleDisconnect(client: any) {
    if(this.server.engine.clientsCount === 0) {
      this.appService.logger.verbose(`Stop emitting`)
      clearInterval(this.appService.emitTimeout!)
      this.appService.emitTimeout = null
    }
  }

  afterInit(server: Server) {

    this.appService.gatewayWsServer = server;

    server.use((socket, next) => {
      console.log(`Connetion: `, socket)
      const token = socket.handshake.auth.token || socket.handshake.headers.token;
      console.log(`Received token: ${token}`)
      if(token) {
        try {
          const payload: JWTPayload = this.jwtService.verify(token);
          socket.data.user = payload;
          socket.join('runners')
          this.appService.logger.verbose(`Runner #${payload.userId} connected!`)
          next();
        } catch (err) {
          console.log('Token not verified', err)
          next(new Error('Unauthorized'));
        }
      } else {
        this.appService.logger.verbose('Spectator connected')
        socket.join('specs')
        next();
      }
    });
  }

  @SubscribeMessage('position')
  async storePosition(
    client: Socket,
    data: PositionPayload
  ) {
    console.log(data)
    return this.appService.handlePositionEvent(client.data.user.userId, data)
  }
}
