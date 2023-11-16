import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of user',
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of user',
    example: 'jhondoe@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Lastname of user',
    example: 'Perez',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'Phone of user',
    example: '0999999999',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Address of user',
    example: 'Av. 9 de Octubre',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Personal id of user',
    example: '0999999999',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  personalId?: string;

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
  @Transform(({ value }) => new Date(value))
  @Type(() => Date)
  @IsOptional()
  birthDay?: Date;

  @ApiProperty({
    description: 'Username of user',
    example: 'juanperez',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
