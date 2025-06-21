import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hash } from 'bcrypt'
import { CreateUserDto } from './dto/auth.dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { user_profiles_table, users_table } from 'src/db/schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private drizzle: DrizzleService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findTechnicalOne(email);
    if (user && compareSync(pass, user.users.password!)) {
      return user;
    }
    return null;
  }

  async register(user: CreateUserDto) {
    const hashedPassword = await hash(user.password, 12)
    
    // TODO: Put the following in a transaction
    const createdUser = (await this.drizzle.client.insert(users_table).values({
      email: user.email,
      password: hashedPassword
    }).returning())[0]

    const createdUserProfile = (await this.drizzle.client.insert(user_profiles_table).values({
      user_id: createdUser.id,
      firstname: user.firstname,
      lastname: user.lastname,
    }).returning())[0]

    const { password, ...safeUser } = createdUser;
    const payload = { email: createdUser.email, sub: createdUserProfile.id, technicalId: createdUser.id };
    return {
      user: safeUser,
      profile: createdUserProfile,
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(user: any) {
    const payload = { email: user.users.email, sub: user.user_profiles.id, technicalId: user.users.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
