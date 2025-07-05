import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

  @ApiProperty({
    example: "john.doe@example.com"
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: "a-really-strong-password"
  })
  @IsString()
  password: string

  @ApiProperty({
    example: "john"
  })
  @IsOptional()
  @IsString()
  firstname?: string

  @ApiProperty({
    example: "doe"
  })
  @IsOptional()
  @IsString()
  lastname?: string
}

export class LoginDto {

  @ApiProperty({
    example: "john.doe@example.com"
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: "a-really-strong-password"
  })
  @IsString()
  password: string

}

export class EmailExistDto {
  @ApiProperty({
    required: true
  })
  @IsString()
  email: string
}