import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt } from 'class-validator';

export class VerifyDisponibilityDto {
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
}
