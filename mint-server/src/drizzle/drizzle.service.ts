import { Injectable } from '@nestjs/common';
import { db } from 'src/db';

@Injectable()
export class DrizzleService {
  client: typeof db = db
}
