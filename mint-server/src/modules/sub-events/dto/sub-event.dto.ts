import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubEventDto {
  @IsString()
  @ApiProperty({
    example: "A new race"
  })
  readonly name: string;

  @IsDateString()
  @ApiProperty({
    example: "2025-07-05T09:00:00.000Z",
  })
  readonly start_date: string;

  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    description: "Une distance custom exprimé en mettre avec une précision de 1mm, pour une distance standard renseignenr le `standard_distance_id`",
    example: "37001.001"
  })
  readonly distance?: string;

  @IsOptional()
  @ApiProperty({
    example: "100.001"
  })
  readonly positive_elevation?: string;

  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    example: 1
  })
  readonly event_id: number;

  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  @ApiProperty({
    required: false,
    default: "",
    description: "Utile si la course est dans un format standard type marathon, voir /api/standard-distances" // TODO: ajouter une table pour la discipline: (running, trail, triathlon, vélo...)
  })
  readonly standard_distance_id?: number;
}

export class CreateSubEventWithFileDto extends CreateSubEventDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'GPX file to upload',
  })
  file: Express.Multer.File;
}

export class AddRunnerToSubEventDto {
  @IsNumber()
  @ApiProperty({
    example: 1
  })
  readonly user_profile_id: number;


  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    default: false
  })
  readonly is_private?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 22066
  })
  readonly bib_number?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "John Doe"
  })
  readonly bib_alias?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  @ApiProperty({
    required: false,
    default: ""
  })
  readonly sub_event_start_wave_id?: number;
}