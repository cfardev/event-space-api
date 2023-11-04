import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { FilterPlaceDto } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createPlaceDto: CreatePlaceDto,
    @GetUser('id') idUser: number,
  ) {
    return this.placeService.create(createPlaceDto, idUser);
  }

  @Get()
  findAll(
    @Query() filterPlaceDto: FilterPlaceDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.placeService.findAll(filterPlaceDto, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(+id, updatePlaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeService.remove(+id);
  }
}
