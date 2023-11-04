import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class FilterPlaceDto {
  @ApiProperty({
    description: 'Category id',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  category?: number;

  @ApiProperty({
    description: 'Department id',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  department?: number;

  @ApiProperty({
    description: 'Min price for place',
    example: 1000,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  minPrice?: number;

  @ApiProperty({
    description: 'Max price for place',
    example: 1000,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({
    description: 'Capacity for place',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  capacity?: number;

  @ApiProperty({
    description: 'Search by name',
    example: 'Casa de playa',
  })
  @IsOptional()
  search?: string;
}
