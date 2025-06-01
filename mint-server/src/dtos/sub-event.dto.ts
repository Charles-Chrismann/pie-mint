import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSubEventDto {
  @IsString()
  name: string;
  
  @IsOptional()
  distance?: number;

  @IsOptional()
  positive_elevation?: number;

  @IsInt()
  event_id: number;

  @IsOptional()
  standard_distance_id?: number;
}