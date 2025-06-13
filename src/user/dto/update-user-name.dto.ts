import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserNameDto {
  @MinLength(8)
  @MaxLength(16)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MinLength(10)
  @MaxLength(20)
  @IsString()
  currentPassword: string;
}
