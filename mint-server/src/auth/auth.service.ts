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
  ) { }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findTechnicalOne(email);
    if (user && await compare(pass, user.user.password!)) {
      return user;
    }
    return null;
  }

  async isEmailTaken(email: string) {
    const user = (await this.drizzle.client.select().from(users_table).where(eq(users_table.email, email)).limit(1))[0]
    return ({ exists: !!user })
  }

  async register(user: CreateUserDto) {

    // TODO: customiza error if already exist

    return this.drizzle.client.transaction(async tx => {

      const hashedPassword = await hash(user.password, 8)

      const createdUser = (await tx.insert(users_table).values({
        email: user.email,
        password: hashedPassword
      }).returning())[0]

      const createdUserProfile = (await tx.insert(user_profiles_table).values({
        user_id: createdUser.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      }).returning())[0]

      const { password, refresh_token, ...safeUser } = createdUser;
      const payload = { email: createdUser.email, sub: createdUserProfile.id, technicalId: createdUser.id };

      const expiresRefreshToken = new Date();
      expiresRefreshToken.setMilliseconds(
        expiresRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            "JWT_REFRESH_TOKEN_EXPIRATION_MS"
          )
        )
      )
      const refresh_token_to_return = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS
      })
      await tx.update(users_table).set({ refresh_token: await hash(refresh_token_to_return, 8) }).where(eq(users_table.id, createdUser.id))

      return {
        user: safeUser,
        profile: {
          id: createdUserProfile.id,
          firstname: createdUserProfile.firstname,
          lastname: createdUserProfile.lastname,
        },
        access_token: this.jwtService.sign(payload),
        refresh_token: refresh_token_to_return
      };
    })
  }

  async login(user: any) {
    console.log(user)
    const payload = { email: user.user.email, sub: user.user_profile.id, technicalId: user.user.id };

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
    await this.drizzle.client.update(users_table).set({ refresh_token: await hash(refresh_token, 8) }).where(eq(users_table.id, user.user.id))

    return {
      technicalUser: {
        id: user.user.id,
        email: user.user.email,
      },
      userProfile: {
        id: user.user_profile.id,
        firstname: user.user_profile.firstname,
        lastname: user.user_profile.lastname,
      },
      access_token: this.jwtService.sign(payload),
      refresh_token
    };
  }

  async verifyUserRefreshToken(refreshToken: string, userId: number) {
    try {
      const user = await this.usersService.findTechnicalOneById(userId);
      const authenticated = await compare(
        refreshToken,
        user.user.refresh_token!
      )

      if (!authenticated) {
        throw new UnauthorizedException();
      }

      return user
    } catch (error: unknown) {
      throw new UnauthorizedException('Refresh token is not valid.');
    }
  }
}
