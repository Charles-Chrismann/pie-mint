import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrganizationDto } from 'src/dtos/organization.dto';

@Controller('organizations')
export class OrganizationsController {

  @Post()
  CreateOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto
  ) {

  }

}
