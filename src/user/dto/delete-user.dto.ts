import { IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteUserDto {
  @MinLength(10)
  @MaxLength(20)
  @IsString()
  currentPassword: string;
}
