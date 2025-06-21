import { ApiProperty } from '@nestjs/swagger';

export class SubEvent {
  @ApiProperty({
    example: "Marathon",
    description: 'The name of the SubEvent'
  })
  name: string;
}
