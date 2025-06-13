import { IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordChangeDto {
  @MinLength(10)
  @MaxLength(20)
  @IsString()
  currentPassword: string;

  @MinLength(10)
  @MaxLength(20)
  @IsString()
  newPassword: string;

  @MinLength(10)
  @MaxLength(20)
  @IsString()
  confirmPassword: string;
}
