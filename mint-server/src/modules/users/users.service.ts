import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  user_profiles_table,
  users_table,
  visitors_table,
} from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class UsersService {
  constructor(private drizzle: DrizzleService) {}

  async findTechnicalOne(email: string) {
    return (
      await this.drizzle.client
        .select()
        .from(users_table)
        .innerJoin(
          user_profiles_table,
          eq(users_table.id, user_profiles_table.user_id),
        )
        .where(eq(users_table.email, email))
        .limit(1)
    )[0];
  }

  async findTechnicalOneById(id: number) {
    return (
      await this.drizzle.client
        .select()
        .from(users_table)
        .innerJoin(
          user_profiles_table,
          eq(users_table.id, user_profiles_table.user_id),
        )
        .where(eq(users_table.id, id))
        .limit(1)
    )[0];
  }

  async getVisitorsByUserId(userId: number) {
    return await this.drizzle.client
      .select()
      .from(visitors_table)
      .where(eq(visitors_table.user_id, userId));
  }

  async createVisitorByUserId(userId: number) {
    const randomCode = this.generateRandomCode(12);
    return await this.drizzle.client
      .insert(visitors_table)
      .values({
        code: randomCode,
        user_id: userId,
      })
      .returning();
  }

  private generateRandomCode(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  // private readonly users = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     password: 'changeme',
  //   },
  //   {
  //     userId: 2,
  //     username: 'maria',
  //     password: 'guess',
  //   },
  // ];

  // async findOne(username: string): Promise<any | undefined> {
  //   return this.users.find(user => user.username === username);
  // }
}
