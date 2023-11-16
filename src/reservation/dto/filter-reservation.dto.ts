import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class FilterReservationDto {
  @ApiProperty({
    description: 'Search by name or place name',
    example: 'Auditorio',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Date',
    example: new Date(),
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({
    description: 'Reservator ID',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  reservatorId?: number;

  @ApiProperty({
    description: 'Host ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  hostId?: number;
}
