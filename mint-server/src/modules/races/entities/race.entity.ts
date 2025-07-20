import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { StandardDistance } from 'src/module-enums/standard-distances/entities/standard-distance.entity';

export class Race {

  @ApiProperty({
    example: "LUT 2025 - 37km",
    description: 'The name of the Race'
  })
  name: string;

  @ApiProperty({
    example: "2025-07-05T09:00:00.000Z",
  })
  start_date: Date;

  @ApiProperty({
    example: 37000,
    description: 'The distance of the race, could be null if standard_distance_id is defined',
    type: String,
    nullable: true
  })
  distance: string | null;

  @ApiProperty({
    example: 10000,
    description: 'The positive elevation of the race',
    type: String,
    nullable: true
  })
  positive_elevation: string | null;

  @ApiProperty({
    example: 1,
    description: 'The event id of that contains this sub event',
    type: Number,
    nullable: true
  })
  event_id: number | null;

  @ApiProperty({
    example: 1,
    description: 'The id of the standard distance such as marathon, Half, 10k',
    type: Number,
    nullable: true
  })
  standard_distance_id: number | null;

  @ApiProperty({
    example: 1,
    description: 'The id of the track',
    type: Number,
    nullable: true
  })
  track_id: number | null;

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
