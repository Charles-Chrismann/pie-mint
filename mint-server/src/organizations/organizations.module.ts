import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';

@Module({
  controllers: [OrganizationsController]
})
export class OrganizationsModule {}
