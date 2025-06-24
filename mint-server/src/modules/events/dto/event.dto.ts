import { Type } from "class-transformer";
import { IsDate, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string

  @Type(() => Number)
  @IsNumber()
  start_date: string

  @Type(() => Number)
  @IsNumber()
  end_date: string

  @Type(() => Number)
  @IsInt()
  organization_id: number
}