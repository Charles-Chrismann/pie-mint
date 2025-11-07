import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length, Matches } from "class-validator";

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

  @ApiProperty({
    example: "JohnDoe"
  })
  @Length(4, 64, { message: 'Le username doit contenir entre 4 et 64 caractères.' })
  @Matches(/^[A-Za-z][A-Za-z0-9._-]*$/, {
    message:
      'Le username doit commencer par une lettre et ne peut contenir que des lettres, chiffres, ".", "-", "_"',
  })
  @IsString()
  username: string
}

export class LoginDto {

  @ApiProperty({
    example: "user@example.com"
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: "password"
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