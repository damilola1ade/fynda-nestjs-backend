import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  username: string;

  @IsOptional()
  password: string;

  @IsOptional()
  avatar: string;
}


export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}