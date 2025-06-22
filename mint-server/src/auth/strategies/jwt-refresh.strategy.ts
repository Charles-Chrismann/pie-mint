import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import TokenPayload from "../TokenPayload.interface";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

  constructor(
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      passReqToCallback: true
    });
  }

  validate(req: Request, payload: TokenPayload): unknown {
    const refreshToken = req.headers.authorization!.replace("Bearer ", '')
    return this.authService.verifyUserRefreshToken(refreshToken, payload.sub)
  }
}