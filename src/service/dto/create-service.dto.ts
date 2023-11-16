import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Name of the service',
    default: 'Service name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Description of the service',
    default: 'Service description',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string;

  @ApiProperty({
    description: 'Icon of the service',
    type: 'file',
  })
  icon: Express.Multer.File;
}
