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
import { FilterPlaceDto, FilterPublicPlaces } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleProtected } from 'src/auth/decorator/role-protected.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Place')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createPlaceDto: CreatePlaceDto,
    @GetUser('id') idUser: number,
  ) {
    return this.placeService.create(createPlaceDto, idUser);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UseGuards(JwtGuard)
  @Get('count')
  count(
    @Query() filterPlaceDto: FilterPlaceDto,
    @GetUser('id') idUser: number,
  ) {
    return this.placeService.count(filterPlaceDto, idUser);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  @RoleProtected(UserRole.ADMIN, UserRole.CORPORATIVE_USER, UserRole.WORKER)
  findAll(
    @Query() filterPlaceDto: FilterPlaceDto,
    @Query() paginationDto: PaginationDto,
    @GetUser('id') idUser?: number,
  ) {
    return this.placeService.findAll(filterPlaceDto, paginationDto, idUser);
  }

  @Get('count/public')
  countPublic(@Query() filterPublicPlaces: FilterPublicPlaces) {
    return this.placeService.countAllPublic(filterPublicPlaces);
  }

  @Get('public')
  findAllPublic(
    @Query() filterPublicPlaces: FilterPublicPlaces,
    @Query() pagination: PaginationDto,
  ) {
    return this.placeService.findAllPublic(filterPublicPlaces, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @GetUser('id') idUser: number,
  ) {
    return this.placeService.update(+id, updatePlaceDto, idUser);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') idUser: number) {
    return this.placeService.remove(+id, idUser);
  }
}
