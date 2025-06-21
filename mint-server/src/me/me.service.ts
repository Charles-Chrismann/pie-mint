import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { organizations_table } from 'src/db/schema';
import { organizations } from 'src/db/seed/constants';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class MeService {

  constructor(private drizzle: DrizzleService) {}

  getUserOrganizations(user: any) {
    return this.drizzle.client.select().from(organizations_table).where(eq(organizations_table.owner_id, user.userId))
  }

  async getSingleOrganization(id: string) {
    return (await this.drizzle.client.select().from(organizations_table).where(eq(organizations_table.id, +id)).limit(1))[0]
  }
}
