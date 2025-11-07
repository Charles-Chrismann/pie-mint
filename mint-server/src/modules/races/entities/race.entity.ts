import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { StandardDistance } from 'src/module-enums/standard-distances/entities/standard-distance.entity';

export class Race {

  @ApiProperty({
    description: 'The id of the Race',
    example: 2,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the Race',
    example: "LUT 2025 - 37km",
  })
  name: string;

  @ApiProperty({
    description: 'The date of the start of the race',
    example: "2025-07-05T09:00:00.000Z",
  })
  start_date: Date;
  @ApiProperty({
    description: 'The date of the end of the race',
    example: "2025-07-05T09:00:00.000Z",
  })
  end_date: Date;

  @ApiProperty({
    example: "37000.000",
    description: 'The distance of the race, could be null if standard_distance_id is defined',
    type: String,
    nullable: true
  })
  distance: string;

  @ApiProperty({
    example: "100.000",
    description: 'The positive elevation of the race',
    type: String,
    nullable: true
  })
  positive_elevation: string;

  @ApiProperty({
    description: 'The standard distance id if the race follow a standard distance such as marathon, half, 10k..., should be null if `distance` is defined',
    example: 1,
    nullable: true
  })
  standard_distance_id: number;

  @ApiProperty({
    description: 'The id of the track created at the same time as the race',
    example: 1,
    nullable: true
  })
  track_id: number;

  @ApiProperty({
    description: 'The id of the race discipline associated with the race, such as Road, Trail, Obstacle',
    example: 1,
    nullable: true
  })
  race_discipline_id: number;
}

export class StartWave {

  @ApiProperty({
    description: 'The id of the startwave',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the startwave',
    example: "The elite wave of the LUT 2025",
  })
  name: string;

  @ApiProperty({
    description: 'The time of the start of the wave',
    example: "2025-03-30T07:30:00.000Z",
  })
  start_date: Date;

  @ApiProperty({
    description: 'The index in start order of the wave, pro/elite wave should be 1',
    example: 1,
  })
  wave_index: number;

  @ApiProperty({
    description: 'Is this wave for elite runners',
    example: true,
  })
  is_elite: boolean;
}

export class NestedRace {
  @ApiProperty({
    description: "The id of the race",
    example: 5
  })
  id: number

  @ApiProperty({
    description: "The name of the race",
    example: "Monistrail - 50K"
  })
  name: number

  @ApiProperty({
    description: "The date of the start of the race",
    example: "2025-06-13T00:00:00.000Z",
  })
  start_date: number

  @ApiProperty({
    description: "The distance of the race",
    example: '54000.000',
    nullable: true,
  })
  distance: number

  @ApiProperty({
    description: "The standard distance if the race is standard",
    nullable: true,
  })
  standard_distance: StandardDistance
}

export class NestedRegistrations {

  @ApiProperty({
    description: "The id of the registration",
    example: 5
  })
  id: number

  @ApiProperty({
    description: "The number of the bib",
    example: 22066
  })
  bib_number: number

  @ApiProperty({
    description: "An optionnal alias of the bib",
    example: 'CharlesTheBoss',
    nullable: true
  })
  bib_alias: string

  @ApiProperty({
    description: 'The race'
  })
  race: Race

  @ApiProperty({
    description: 'The start wave where the runner is',
  })
  start_wave: StartWave
}