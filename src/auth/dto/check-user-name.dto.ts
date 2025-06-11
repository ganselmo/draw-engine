import { IsString } from 'class-validator';

export class checkUserNameDto {
  @IsString()
  username: string;
}
