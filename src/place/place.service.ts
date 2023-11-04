import { Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterPlaceDto } from './dto';
import { UserRole } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlaceDto: CreatePlaceDto, userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    const newPlace = await this.prisma.place.create({
      data: {
        name: createPlaceDto.name,
        description: createPlaceDto.description,
        latitude: createPlaceDto.latitude,
        longitude: createPlaceDto.longitude,
        cheaperPrice: createPlaceDto.pricePerHour,
        minCapacity: createPlaceDto.capacity,
        categoryId: createPlaceDto.categoryId,
        userId: user.id,
        departmentId: createPlaceDto.departmentId,
        Room: {
          createMany: {
            data: createPlaceDto.rooms.map((room) => ({
              name: room.name,
              capacity: room.capacity,
              pricePerHour: room.pricePerHour,
            })),
          },
        },
        PlaceService: {
          createMany: {
            data: createPlaceDto.services.map((service) => ({
              serviceId: service.serviceId,
              price: service.price,
              providerEmail: service.providerEmail,
              providerPhone: service.providerPhone,
              providerName: service.providerName,
            })),
          },
        },
      },
    });

    //If rooms is empty create a default one
    if (createPlaceDto.rooms.length === 0) {
      await this.prisma.room.create({
        data: {
          name: 'Sala Principal',
          capacity: createPlaceDto.capacity,
          pricePerHour: createPlaceDto.pricePerHour,
          placeId: newPlace.id,
        },
      });
    }

    return newPlace;
  }

  async count(filterPlaceDto: FilterPlaceDto) {
    return this.prisma.place.count({
      where: {
        name: {
          contains: filterPlaceDto.search,
          mode: 'insensitive',
        },
        categoryId: filterPlaceDto.category,
        departmentId: filterPlaceDto.department,
        cheaperPrice: {
          gte: filterPlaceDto.minPrice,
          lte: filterPlaceDto.maxPrice,
        },
        minCapacity: {
          lte: filterPlaceDto.capacity,
        },
      },
    });
  }

  async findAll(filterPlaceDto: FilterPlaceDto, pagination: PaginationDto) {
    const { limit = 16, offset = 0 } = pagination;
    const { search = '' } = filterPlaceDto;

    const places = await this.prisma.place.findMany({
      take: limit,
      skip: offset,
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        categoryId: filterPlaceDto.category,
        departmentId: filterPlaceDto.department,
        cheaperPrice: {
          gte: filterPlaceDto.minPrice,
          lte: filterPlaceDto.maxPrice,
        },
        minCapacity: {
          lte: filterPlaceDto.capacity,
        },
      },
    });

    return places;
  }

  findOne(id: number) {
    return `This action returns a #${id} place`;
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
