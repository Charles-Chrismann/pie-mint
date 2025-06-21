import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { events_table, organizations_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class OrganizationsService {
  constructor(private drizzle: DrizzleService) {}

  getAllOrganizanizations() {
    return this.drizzle.client.select().from(organizations_table)
  }

  async getOrganizanizationById(organizationId: number) {
    return (await this.drizzle.client.select().from(organizations_table).where(eq(organizations_table.id, organizationId)).limit(1))[0]
  }

  getOrganizanizationEvents(organizationId: number) {
    return this.drizzle.client.select().from(events_table).where(eq(events_table.organization_id, organizationId))
  }
}
