import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FilterUserDto {
  @ApiProperty({ required: false, description: 'Search by name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by role',
    enum: UserRole,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(UserRole, { each: true })
  @Transform(({ value }) => value.split(','), { toClassOnly: true })
  roles?: UserRole[];
}
