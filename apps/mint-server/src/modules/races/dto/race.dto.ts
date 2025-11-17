import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsDateString, IsInt, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateRaceDto {
  @IsString()
  @ApiProperty({
    example: "A new race"
  })
  readonly name: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: "2025-07-05T09:00:00.000Z",
    nullable: true,
  })
  readonly start_date: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: "2025-07-05T09:00:00.000Z",
    nullable: true,
  })
  readonly end_date?: Date;

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

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value === "" ? undefined : value)
  @ApiProperty({
    required: false,
    default: "",
  })
  readonly event_id?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value === "" ? undefined : value)
  @ApiProperty({
    required: false,
    default: "",
  })
  readonly organization_id?: number;

  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  @ApiProperty({
    required: false,
    default: "",
    description: "Utile si la course est dans un format standard type marathon, voir /api/standard-distances" // TODO: ajouter une table pour la discipline: (running, trail, triathlon, vélo...)
  })
  readonly standard_distance_id?: number;

  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  @ApiProperty({
    required: false,
    default: "",
    description: "" // TODO: ajouter une table pour la discipline: (running, trail, triathlon, vélo...)
  })
  readonly race_discipline_id: number = 2;
}

export class CreateRaceWithFileDto extends CreateRaceDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'GPX file to upload',
  })
  file: Express.Multer.File;
}

export class UpdateRaceDto {

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "A new race"
  })
  readonly name?: string;

  @IsOptional()
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

  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  @ApiProperty({
    required: false,
    default: "",
    description: "Utile si la course est dans un format standard type marathon, voir /api/standard-distances" // TODO: ajouter une table pour la discipline: (running, trail, triathlon, vélo...)
  })
  readonly standard_distance_id?: number;
}

export class UpdateRaceWithFileDto extends UpdateRaceDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'GPX file to upload',
  })
  file: Express.Multer.File;
}

export class AddRunnerToRaceDto {
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
  readonly race_start_wave_id?: number;
}

export class GetRacesAroundQueryDto {
  @ApiProperty({
    required: true,
    default: "44.99637,3.82174"
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value.split(',')
  )
  coordinates: string

  @ApiProperty({
    required: false,
    description: 'Rayon en mètres',
    default: 10000,
  })
  @IsOptional()
  @Type(() => Number)
  radius: number = 10000;

  @ApiProperty({
    required: false,
    default: false,
    description: 'Filtrer les courses qui débute dans le rayon',
  })
  @IsOptional()
  @Type(() => Boolean)
  startsOnly: boolean = false;
}

export class GetRaceByIdParamDto {
  @ApiProperty({
    required: true,
    example: 5,
    description: 'The id of the race.',
  })
  @IsNumber()
  @Type(() => Number)
  raceId: number;
}