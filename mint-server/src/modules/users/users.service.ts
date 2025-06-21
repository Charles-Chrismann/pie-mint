import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { user_profiles_table, users_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class UsersService {

  constructor(private drizzle: DrizzleService) {}

  async findTechnicalOne(email: string) {
    return (await this.drizzle.client.select()
    .from(users_table)
    .innerJoin(user_profiles_table, eq(users_table.id, user_profiles_table.user_id))
    .where(eq(users_table.email, email))
    .limit(1))[0]
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
