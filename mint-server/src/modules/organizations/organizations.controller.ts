import { Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/organizations';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JWTUser } from 'src/declaration';

@Controller('organizations')
export class OrganizationsController {

  constructor(private organizationsService: OrganizationsService) { }

  @Get('')
  getAllOrganizanizations() {
    return this.organizationsService.getAllOrganizanizations()
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  createOrganization(
    @CurrentUser() user: JWTUser,
    @Body() createOrganizationDto: CreateOrganizationDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    }
  ) {
    return this.organizationsService.createOrganization(user, createOrganizationDto, files)
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
