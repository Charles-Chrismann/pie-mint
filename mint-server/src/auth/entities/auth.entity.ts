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
    example: 1
  })
  id: number

  @ApiProperty({
    example: "john.doe@example.com"
  })
  email: string | null
}

class UserProfileEntity {
  @ApiProperty({
    example: 1
  })
  id: number

  @ApiProperty({
    example: "John"
  })
  firstname: string | null;

  @ApiProperty({
    example: "Doe"
  })
  lastname: string | null;

  @ApiProperty({
    example: 1
  })
  user_id: number;
}

export class UserRegisterResponse {

  @ApiProperty({ type: () => UserEntity})
  user: UserEntity

  @ApiProperty({ type: () => UserProfileEntity})
  profile: UserProfileEntity

  @ApiProperty({
    description: "The authorization bearer token to include in the header au authenticated requests: `Bearer eydfdsfdfs.fsfs.fsfs`",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIkNvbmdyYXRzICEiOiJZb3UgZm91bmQgYW4gZWFzdGVyIGVnZyAhIiwiaWF0IjoxNTE2MjM5MDIyfQ.52JeXWZJowUuw5f3AV77NWzB5ZC3ltUqzGMSc79NkGU"
  })
  access_token: string

  @ApiProperty({
    description: "The refresh token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIkNvbmdyYXRzICEiOiJZb3UgZm91bmQgYW4gZWFzdGVyIGVnZyAhIiwiaWF0IjoxNTE2MjM5MDIyfQ.52JeXWZJowUuw5f3AV77NWzB5ZC3ltUqzGMSc79NkGU"
  })
  refresh_token?: string
}

export class UserLoginResponse {

  @ApiProperty({ type: () => UserEntity})
  technicalUser: UserEntity

  @ApiProperty({ type: () => UserProfileEntity})
  userProfile: UserProfileEntity

  @ApiProperty({
    description: "The authorization bearer token to include in the header au authenticated requests: `Bearer eydfdsfdfs.fsfs.fsfs`",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIkNvbmdyYXRzICEiOiJZb3UgZm91bmQgYW4gZWFzdGVyIGVnZyAhIiwiaWF0IjoxNTE2MjM5MDIyfQ.52JeXWZJowUuw5f3AV77NWzB5ZC3ltUqzGMSc79NkGU"
  })
  access_token: string

  @ApiProperty({
    description: "The refresh token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIkNvbmdyYXRzICEiOiJZb3UgZm91bmQgYW4gZWFzdGVyIGVnZyAhIiwiaWF0IjoxNTE2MjM5MDIyfQ.52JeXWZJowUuw5f3AV77NWzB5ZC3ltUqzGMSc79NkGU"
  })
  refresh_token?: string
}