import { Injectable } from '@nestjs/common';
import { standard_distances_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class StandardDistancesService {

  constructor(private drizzle: DrizzleService) {}
  
  async getStandardDistances() {
    return this.drizzle.client.select().from(standard_distances_table)
  }
}
