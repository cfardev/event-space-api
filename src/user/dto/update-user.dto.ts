import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Name of user',
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Lastname of user',
    example: 'Perez',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastname: string;

  @ApiProperty({
    description: 'Phone of user',
    example: '0999999999',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: 'Address of user',
    example: 'Av. 9 de Octubre',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;

  @ApiProperty({
    description: 'Personal id of user',
    example: '0999999999',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  personalId: string;

  @ApiProperty({
    description: 'Company name of user',
    example: 'Empresa',
  })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty({
    description: 'Ruc of user',
    example: '0999999999',
  })
  @IsString()
  @IsOptional()
  ruc?: string;

  @ApiProperty({
    description: 'Birthday of user',
    example: '2021-01-01',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @Type(() => Date)
  birthDay?: Date;

  @ApiProperty({
    description: 'Avatar of user',
    type: 'file',
  })
  avatar?: Express.Multer.File;
}
