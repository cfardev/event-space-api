import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class RoomDto {
  @IsString()
  name: string;

  @IsNumber()
  pricePerHour: number;

  @IsNumber()
  capacity: number;
}

class ServiceDto {
  @ApiProperty({
    description: 'Service id',
    example: 1,
  })
  @IsNumber()
  serviceId: number;

  @ApiProperty({
    description: 'Service price in Cordobas',
    example: 500,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Provider name',
    example: 'Juan Perez',
  })
  @IsString()
  providerName: string;

  @ApiProperty({
    description: 'Provider email',
    example: 'juanperez@gmail.com',
  })
  @IsString()
  providerEmail: string;

  @ApiProperty({
    description: 'Provider phone',
    example: '88888888',
  })
  @IsString()
  providerPhone: string;
}

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Place name',
    example: 'Hotel',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Place price per hour',
    example: 1000,
  })
  @IsNumber()
  pricePerHour: number;

  @ApiProperty({
    description: 'Place latitude cords',
    example: 9.2323123,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Place longitude cords',
    example: -82.2323123,
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'Category id',
    example: 1,
  })
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    description: 'Department id',
    example: 1,
  })
  @IsNumber()
  departmentId: number;

  @ApiProperty({
    description: 'Place description',
    example: 'Hotel description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Place capacity',
    example: 200,
  })
  @IsNumber()
  capacity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  rooms: RoomDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services: ServiceDto[];
}
