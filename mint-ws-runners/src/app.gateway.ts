import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {


  @WebSocketServer()
  server: Server;

  count = 0
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    this.count++

    if(this.count % 100 === 0) console.log(this.count)
    // console.log(payload)
    return 'Hello world!';
  }

  handleConnection(socket: Socket): void {
    console.log('elo')
  }

  @SubscribeMessage('position')
  handlePosition(client: any, payload: any) {
    this.server.emit('position', payload)
  }
}
