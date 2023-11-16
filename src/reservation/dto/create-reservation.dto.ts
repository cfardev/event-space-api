import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsCreditCard, Max, IsString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: 'Start date of the reservation',
    type: Date,
    example: '2021-08-01 00:00:00',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'End date of the reservation',
    type: Date,
    example: '2021-08-01 00:00:00',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: 'Place id of the reservation',
    type: Number,
    example: 1,
  })
  @IsInt()
  placeId: number;

  @ApiProperty({
    description: 'Services ids of the reservation',
    type: [Number],
    example: [1, 2],
  })
  @IsInt({ each: true })
  services: number[];

  @ApiProperty({
    description: 'Payment name',
    type: String,
    example: 'Carlos Arcia',
  })
  @IsString()
  paymentName: string;

  @ApiProperty({
    description: 'Credit card number',
    type: String,
    example: '4111111111111111',
  })
  @IsCreditCard()
  creditCardNumber: string;

  @ApiProperty({
    description: 'Credit card expiration month',
    type: Number,
    example: 12,
  })
  @IsInt()
  @Max(12)
  expirationMonth: number;

  @ApiProperty({
    description: 'Credit card expiration year',
    type: Number,
    example: 2021,
  })
  @IsInt()
  expirationYear: number;

  @ApiProperty({
    description: 'Credit card cvv',
    type: Number,
    example: 123,
  })
  @IsInt()
  @Max(999)
  cvv: number;
}
