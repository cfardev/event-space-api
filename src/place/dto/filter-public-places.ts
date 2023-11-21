import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class FilterPublicPlaces {
  @ApiProperty({
    description: 'Category id',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  category?: number;

  @ApiProperty({
    description: 'Department id',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  department?: number;

  @ApiProperty({
    description: 'Min price for place',
    example: 1000,
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({
    description: 'Max price for place',
    example: 1000,
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({
    description: 'Capacity for place',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  capacity?: number;

  @ApiProperty({
    description: 'Search by name',
    example: 'Casa de playa',
    required: false,
  })
  @IsOptional()
  search?: string;
}
