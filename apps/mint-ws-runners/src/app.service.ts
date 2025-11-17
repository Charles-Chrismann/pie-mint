import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {

  onModuleInit() {
  }
  getHello(): string {
    return 'Hello World!';
  }
}
