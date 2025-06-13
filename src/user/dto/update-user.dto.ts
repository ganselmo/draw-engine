
import { IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto{
    
      @MaxLength(255)
      @IsString()
      fullName: string;
    
      @IsPhoneNumber()
      @IsOptional()
      phoneNumber?: string;
    
      @MaxLength(255)
      @IsString()
      @IsOptional()
      address?: string;
}
