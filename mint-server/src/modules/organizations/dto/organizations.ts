import { IsString } from "class-validator";

export class CreateOrganizationDto {
  @IsString()
  name: string
}