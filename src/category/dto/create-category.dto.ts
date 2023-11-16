import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of category',
    example: 'Category 1',
  })
  @IsString()
  name: string;
  @ApiProperty({
    description: 'Description of category',
    example: 'Description of category 1',
  })
  @IsString()
  description: string;
}
