import { ApiProperty } from '@nestjs/swagger';

export class EmailExistResponse {
  @ApiProperty({
    example: true,
    description: 'The email exists'
  })
  exists: boolean;
}

class UserEntity {
  @ApiProperty({
    example: 1,
    description: "The user id"
  })
  id: number

  @ApiProperty({
    example: "user@example.com",
    description: "The user email"
  })
  email: string
}

class UserProfileEntity {
  @ApiProperty({
    example: 1,
    description: "The user profile id"
  })
  id: number

  @ApiProperty({
    example: "user",
    description: "The user firstname"
  })
  firstname: string;

  @ApiProperty({
    example: "user",
    description: "The user lastname"
  })
  lastname: string;
}

export class AbstractUserAuthResponse {
  @ApiProperty({
    description: "The authorization bearer token to include in the header au authenticated requests: `Bearer eydfdsfdfs.fsfs.fsfs`",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIkNvbmdyYXRzICEiOiJZb3UgZm91bmQgYW4gZWFzdGVyIGVnZyAhIiwiaWF0IjoxNTE2MjM5MDIyfQ.52JeXWZJowUuw5f3AV77NWzB5ZC3ltUqzGMSc79NkGU",
  })
  access_token: string

  @ApiProperty({
    description: "The refresh token, it has a way longer validity period, use it to refresh the access_token (every 14 minutes in production since the access_token is valid for 15 minutes)",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIkNvbmdyYXRzICEiOiJZb3UgZm91bmQgYW4gZWFzdGVyIGVnZyAhIiwiaWF0IjoxNTE2MjM5MDIyfQ.52JeXWZJowUuw5f3AV77NWzB5ZC3ltUqzGMSc79NkGU",
  })
  refresh_token?: string
}

export class UserRegisterResponse extends AbstractUserAuthResponse {

  @ApiProperty({
    type: UserEntity,
    description: 'Those infos are privates'
  })
  user: UserEntity

  @ApiProperty({
    type: UserProfileEntity,
    description: 'Those infos are publics'
  })
  profile: UserProfileEntity
}

export class UserLoginResponse extends AbstractUserAuthResponse {

  @ApiProperty({ type: UserEntity })
  technicalUser: UserEntity

  @ApiProperty({ type: UserProfileEntity })
  userProfile: UserProfileEntity
}