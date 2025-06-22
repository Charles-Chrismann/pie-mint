import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { organizations_table, user_profiles_table, users_table } from 'src/db/schema';
import { organizations } from 'src/db/seed/constants';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class MeService {

  constructor(private drizzle: DrizzleService) {}

  async getUser(user: any) {
    const userData = (await this.drizzle.client.select().from(users_table).leftJoin(user_profiles_table, eq(users_table.id, user_profiles_table.user_id)).limit(1))[0]
    return {
      technicalUser: {
        id: userData.users.id,
        email: userData.users.email,
      },
      userProfile: userData.user_profiles
    };
  }

  getUserOrganizations(user: any) {
    return this.drizzle.client.select().from(organizations_table).where(eq(organizations_table.owner_id, user.userId))
  }

  async getSingleOrganization(id: string) {
    return (await this.drizzle.client.select().from(organizations_table).where(eq(organizations_table.id, +id)).limit(1))[0]
  }
}
