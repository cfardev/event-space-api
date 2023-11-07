import { UserRole } from '@prisma/client';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
