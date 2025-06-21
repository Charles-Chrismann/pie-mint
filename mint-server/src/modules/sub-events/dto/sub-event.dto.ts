import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSubEventDto {
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: "Une distance custom exprimé en mettre avec une précision de 1mm, pour une distance standard renseignenr le `standard_distance_id`",
    example: "37001.001"
  })
  readonly distance?: string;

  @IsOptional()
  @ApiProperty()
  readonly positive_elevation?: number;

  @IsInt()
  @ApiProperty()
  readonly event_id: number;

  @IsInt()
  @ApiProperty()
  readonly track_id?: number;

  @IsOptional()
  @ApiProperty({
    required: false
  })
  readonly standard_distance_id?: number;
}