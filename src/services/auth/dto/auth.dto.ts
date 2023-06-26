import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  isActive: boolean;
}
