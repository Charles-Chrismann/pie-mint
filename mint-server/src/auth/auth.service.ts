import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findTechnicalOne(email);
    if (user && compareSync(pass, user.users.password!)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    console.log(user)
    const payload = { email: user.users.email, sub: user.user_profiles.id, technicalId: user.users.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
