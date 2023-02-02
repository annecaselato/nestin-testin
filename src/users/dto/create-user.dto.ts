import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Test User' })
  name: string;

  @ApiProperty({ example: 'test.user@email.com' })
  email: string;
}
