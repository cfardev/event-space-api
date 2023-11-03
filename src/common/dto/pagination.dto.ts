import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'Numero de la página en la que quieres estar',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    type: Number,
    description: 'El tamaño de cada página',
    example: 10,
    default: 100,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  size?: number;
}
