import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { FilterReservationDto, VerifyDisponibilityDto } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Reservation')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtGuard)
  @Post('verify-disponibility')
  verifyDisponibility(@Body() verifyDisponibilityDto: VerifyDisponibilityDto) {
    return this.reservationService.verifyDisponibility(verifyDisponibilityDto);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser('id', ParseIntPipe) userId: number,
  ) {
    return this.reservationService.create(createReservationDto, userId);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() filterReservation: FilterReservationDto,
    @GetUser('id') userId: number,
  ) {
    return this.reservationService.findAll(
      filterReservation,
      pagination,
      userId,
    );
  }

  @UseGuards(JwtGuard)
  @Get('count')
  count(
    @GetUser('id') userId: number,
    @Query() filterReservation: FilterReservationDto,
  ) {
    return this.reservationService.count(filterReservation, userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.reservationService.remove(+id, userId);
  }
}
