import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubEventDto {
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    description: "Une distance custom exprimé en mettre avec une précision de 1mm, pour une distance standard renseignenr le `standard_distance_id`",
    example: "37001.001"
  })
  readonly distance?: string;

  @IsOptional()
  @ApiProperty()
  readonly positive_elevation?: string;

  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  readonly event_id: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  readonly track_id?: number;

  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    required: false
  })
  readonly standard_distance_id?: number;
}

export class AddRunnerToSubEventDto {
  @IsNumber()
  @ApiProperty()
  readonly user_profile_id: number;


  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly is_private?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly bib_number?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly bib_alias?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly sub_event_start_wave_id?: number;
}