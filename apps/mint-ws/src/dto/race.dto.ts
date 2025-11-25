
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class registerRaceDTO {

	@IsNotEmpty()
	id: string

	@IsDateString()
	startDate: string

	@IsDateString()
	endDate: string

	@IsArray()
  @IsString({ each: true })
	runnerIds: string[]
}