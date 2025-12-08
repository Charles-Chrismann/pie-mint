
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class RegisterRaceDTO {

	@IsNotEmpty()
	id: string

	@IsDateString()
	startDate: string

	@IsDateString()
	endDate: string

	@IsArray()
  @IsString({ each: true })
	runnerIds: string[]

	@IsString()
	gpx: string
}