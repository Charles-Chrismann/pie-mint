import { ApiProperty } from "@nestjs/swagger";

export class CreateOrganizationResponse {
  
  @ApiProperty({
    example: 1
  })
  id: number;

  @ApiProperty({
    example: "Schneider Electric"
  })
  name: string;

  @ApiProperty({
    example: false,
    nullable: true
  })
  is_auto_generated: boolean | null;

  @ApiProperty({
    example: 1,
    nullable: true
  })
  media_avatar_id: number | null;

  @ApiProperty({
    example: 1,
    nullable: true
  })
  media_banner_id: number | null;

  @ApiProperty({
    example: 1
  })
  created_by_id: number;

  @ApiProperty({
    example: 2,
  })
  owner_id: number;
}