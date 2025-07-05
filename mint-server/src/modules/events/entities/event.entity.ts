import { ApiProperty } from "@nestjs/swagger";

export class Event {

  @ApiProperty({
    example: 1
  })
  id: number;

  @ApiProperty({
    example: "UTMB 2025"
  })
  name: string | null;

  @ApiProperty({
    example: "The UTMB come back this year again..."
  })
  description: string | null;

  @ApiProperty({
    description: "Has this event been auto generated ?",
    example: false
  })
  is_auto_generated: boolean | null;

  @ApiProperty({
    example: "2025-08-25T00:00:00.000Z"
  })
  start_date: Date | null;

  @ApiProperty({
    example: "2025-08-31T00:00:00.000Z"
  })
  end_date: Date | null;

  @ApiProperty({
    example: 1
  })
  organization_id: number;
}