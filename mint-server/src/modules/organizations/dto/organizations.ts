import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateOrganizationDto {

  @ApiProperty({
    example: "Schneider Electric"
  })
  @IsString()
  name: string;
}