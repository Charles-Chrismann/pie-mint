import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from './Redis';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    const pubClient = Redis.duplicate();
    const subClient = Redis.duplicate();

    server.adapter(createAdapter(pubClient, subClient));

    return server;
  }
}
