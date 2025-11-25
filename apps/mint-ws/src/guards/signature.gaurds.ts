import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignatureGuard implements CanActivate {
  
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const auth = request.headers['authorization'];

    if (!auth) {
      throw new UnauthorizedException("Missing Authorization header");
    }

    const expectedToken = this.config.getOrThrow<string>('SIGNATURE_SECRET');

    if (auth !== `Bearer ${expectedToken}`) {
      throw new UnauthorizedException("Invalid token");
    }

    return true;
  }
}
