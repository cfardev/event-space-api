import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'Numero de elementos que quieres que se muestren',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    type: Number,
    example: 10,
    default: 100,
    description:
      'Numero de elementos que quieres que se salten desde el inicio',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number;
}
