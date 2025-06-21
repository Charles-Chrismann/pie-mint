import { ApiProperty } from "@nestjs/swagger";

export class StandardDistance {
  @ApiProperty()
  id: number;

  @ApiProperty({
    example: "Marathon"
  })
  name: string;


  @ApiProperty({
    example: "42195",
    description: "La distance standard en mètres avec présicion 1mm"
  })
  distance: string;
}