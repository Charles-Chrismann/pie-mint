import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEventDto {

  @ApiProperty({
    example: "UTMB 2025"
  })
  @IsString()
  name: string

  @ApiProperty({
    description: "The event representing the races for the 2025 UTMB event (20K, 50K, 100K, 100M)",
    example: "The UTMB come back this year again..."
  })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({
    example: "2025-08-25T00:00:00.000Z",
    type: 'string',
    format: 'date-time',
    description: 'Start date in ISO format',
  })
  @IsString()
  start_date: string

  @ApiProperty({
    example: "2025-08-31T00:00:00.000Z",
    type: 'string',
    format: 'date-time',
    description: 'End date in ISO format',
  })
  @IsString()
  end_date: string

  @ApiProperty({
    example: 1
  })
  @Type(() => Number)
  @IsInt()
  organization_id: number
}