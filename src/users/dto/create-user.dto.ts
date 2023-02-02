import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { IsAvailableEmail } from './email-availability';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'Test User' })
  name: string;

  @IsEmail()
  @IsAvailableEmail()
  @ApiProperty({ example: 'test.user@email.com' })
  email: string;
}
