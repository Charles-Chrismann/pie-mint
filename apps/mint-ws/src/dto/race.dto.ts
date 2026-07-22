
import { ApiProperty } from '@nestjs/swagger';
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

export class CreateReplayDto {

	@IsString()
	@IsNotEmpty()
  id: string

	@IsString()
	@IsNotEmpty()
  name: string

	@IsDateString()
  startDate: string

  files: Array<{
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    buffer: Buffer,
    size: number
  }>
}