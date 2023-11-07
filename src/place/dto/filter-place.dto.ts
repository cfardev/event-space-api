import { ApiProperty } from '@nestjs/swagger';
import { PlaceStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class FilterPlaceDto {
  @ApiProperty({
    description: 'Category id',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  category?: number;

  @ApiProperty({
    description: 'Department id',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  department?: number;

  @ApiProperty({
    description: 'Min price for place',
    example: 1000,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({
    description: 'Max price for place',
    example: 1000,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({
    description: 'Capacity for place',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  capacity?: number;

  @ApiProperty({
    description: 'Search by name',
    example: 'Casa de playa',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Status for place',
    example: PlaceStatus.APPROVED,
  })
  @IsEnum(PlaceStatus)
  @IsOptional()
  status?: PlaceStatus;

  @ApiProperty({
    description: 'Show only my places',
    example: true,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @Transform(({ value }) => value === 'true')
  myPlaces?: boolean;
}
