import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { events_table, organizations_table, sub_events_table } from 'src/db/schema';
import { DBOrganization } from 'src/declaration';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class AuthorizationService {

  constructor(private drizzle: DrizzleService) { }

  async isAllowedToCreateEvent(userId: number, organizationId: number) {
    const organization = (await this.drizzle.client
      .select()
      .from(organizations_table)
      .where(eq(organizations_table.id, organizationId))
      .limit(1)
    )[0] as DBOrganization | undefined

    if(!organization) throw new NotFoundException()

    if (organization.owner_id === userId) return true

    // TODO: add logic for groups and permissions

    return false
  }

  async canAddRunnerToSubEvent(
    userId: number,
    subEventId: number
  ) {

    const org: any = (await this.drizzle.client
      .select()
      .from(organizations_table)
      .innerJoin(events_table, eq(events_table.organization_id, organizations_table.id))
      .innerJoin(sub_events_table, eq(sub_events_table.event_id, events_table.id))
      .where(eq(sub_events_table.id, subEventId))
      .limit(1))[0]

      console.log(org)

    if (org.organizations.owner_id === userId) return true

    return false
  }

}
