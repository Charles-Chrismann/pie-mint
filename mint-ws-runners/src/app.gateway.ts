import { OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnModuleInit {

  lastSecondEvents: any[] = []
  emitTimeout: NodeJS.Timeout

  onModuleInit() {
    this.emitTimeout = setInterval(() => {
      this.server.to('spec').emit('positions', this.lastSecondEvents)
      this.lastSecondEvents = []
    }, 1000)
  }

  positions: any[] = []

  @WebSocketServer()
  server: Server;

  count = 0
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.count++

    if(this.count % 100 === 0) console.log(this.count)
    // console.log(payload)
    return;
  }

  handleConnection(socket: Socket): void {
    console.log('elo')
  }

  @SubscribeMessage('position')
  handlePosition(client: any, payload: any) {
    this.lastSecondEvents.push(payload)
    // this.server.to('spec').emit('position', payload);
  }

  @SubscribeMessage('spec')
  handleSpec(client: Socket, payload: any) {
    client.join('spec')
  }
}
