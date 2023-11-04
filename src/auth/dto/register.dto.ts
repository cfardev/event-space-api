import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    type: String,
  })
  @IsNotEmpty()
  @MinLength(3)
  lastName: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    type: String,
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    type: String,
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Nick del usuario',
    minLength: 6,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Repetir contraseña del usuario',
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(6)
  repeatPassword: string;

  @ApiProperty({
    description: 'DNI del usuario',
    minLength: 8,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsOptional()
  dni?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    type: Date,
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthDay?: Date;

  @ApiProperty({
    description: 'Número de RUC de la compañia',
    type: String,
  })
  @IsNotEmpty()
  @IsOptional()
  ruc?: string;

  @ApiProperty({
    description: 'Nombre de la compañia (razon social)',
    type: String,
  })
  @IsNotEmpty()
  @IsOptional()
  companyName?: string;
}
