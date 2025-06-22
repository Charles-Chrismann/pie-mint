import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare, compareSync, hash } from 'bcrypt'
import { CreateUserDto } from './dto/auth.dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { user_profiles_table, users_table } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private drizzle: DrizzleService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findTechnicalOne(email);
    if (user && compareSync(pass, user.users.password!)) {
      return user;
    }
    return null;
  }

  async isEmailTaken(email: string) {
    const user = (await this.drizzle.client.select().from(users_table).where(eq(users_table.email, email)).limit(1))[0]
    return ({ exists: !!user })
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

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() + 
      parseInt(
        this.configService.getOrThrow<string>(
          "JWT_REFRESH_TOKEN_EXPIRATION_MS"
        )
      )
    )
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS
    })

    await this.drizzle.client.update(users_table).set({refresh_token: await hash(refresh_token, 12)}).where(eq(users_table.id, user.users.id))

    return {
      technicalUser: {
        id: user.users.id,
        email: user.users.email,
      },
      userProfile: user.user_profiles,
      access_token: this.jwtService.sign(payload),
      refresh_token
    };
  }

  async verifyUserRefreshToken(refreshToken: string, userId: number) {
    try {
      const user = await this.usersService.findTechnicalOneById(userId);
      const authenticated = await compare(
        refreshToken,
        user.users.refresh_token!
      )

      if(!authenticated) {
        throw new UnauthorizedException();
      }

      return user
    } catch (error: unknown) {
      throw new UnauthorizedException('Refresh token is nnot valid.');
    }
  }
}
