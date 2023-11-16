import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole, { each: true })
  @Transform(({ value }) => value.split(','), { toClassOnly: true })
  roles?: UserRole[];
}
