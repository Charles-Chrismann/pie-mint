import { Global, Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';

@Global()
@Module({
  providers: [AuthorizationService],
  exports: [AuthorizationService]
})
export class AuthorizationModule {}
