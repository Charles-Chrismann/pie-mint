import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { events_table, organizations_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { CreateOrganizationDto } from './dto/organizations';
import { JWTUser } from 'src/declaration';

@Injectable()
export class OrganizationsService {
  constructor(private drizzle: DrizzleService) { }

  async createOrganization(
    user: JWTUser,
    createOrganizationDto: CreateOrganizationDto,
    files: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    }) {
    const createdOrganization = await this.drizzle.client.transaction(async (tx) => {
      const createdOrganization = (await tx
        .insert(organizations_table)
        .values({
          name: createOrganizationDto.name,
          created_by_id: user.userId,
          owner_id: user.userId,
        }).returning())[0]

      // TODO: prendre en charge les fichiers

      return createdOrganization
    })

    return createdOrganization
  }

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
