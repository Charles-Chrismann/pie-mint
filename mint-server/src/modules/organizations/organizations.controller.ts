import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {

  constructor(private organizationsService: OrganizationsService) {}

  // @Post()
  // CreateOrganization(
  //   @Body() createOrganizationDto: CreateOrganizationDto
  // ) {

  // }

  @Get('')
  getAllOrganizanizations() {
    return this.organizationsService.getAllOrganizanizations()
  }

  @Get(':organizationId')
  getOrganizanizationById(
    @Param('organizationId') organizationId: string
  ) {
    return this.organizationsService.getOrganizanizationById(+organizationId)
  }

  @Get(':organizationId/events')
  getOrganizanizationEvents(
    @Param('organizationId') organizationId: string
  ) {
    return this.organizationsService.getOrganizanizationEvents(+organizationId)
  }
}
