import { ApiProperty } from "@nestjs/swagger";

export class StandardDistance {
  @ApiProperty({
    description: 'The id of the standard distance',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'The name of the standard distance',
    example: "Marathon"
  })
  name: string;


  @ApiProperty({
    description: "The standard distance in meters with a precision of 1mm.",
    example: "42195.000",
  })
  distance: string;
}