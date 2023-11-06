import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterPlaceDto } from './dto';
import { UserRole } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CRUDPrismaCatchError } from 'src/common/utils/catchErrorsUtils';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(PlaceService.name);

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

  async findAll(
    filterPlaceDto: FilterPlaceDto,
    pagination: PaginationDto,
    userId: number,
  ) {
    try {
      const { limit = 16, offset = 0 } = pagination;
      const { search = '' } = filterPlaceDto;

      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

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

          status:
            user.role === UserRole.USER ||
            user.role === UserRole.CORPORATIVE_USER
              ? 'APPROVED'
              : undefined,
        },
      });

      return places;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  findOne(id: number) {
    try {
      const place = this.prisma.place.findUnique({
        where: { id },
        include: {
          PlaceService: {
            include: {
              service: true,
            },
          },
          Room: true,
          user: true,
          category: true,
          department: true,
        },
      });

      if (!place) {
        throw new NotFoundException('Place not found');
      }

      return place;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto, userId: number) {
    try {
      if (!this.checkPlaceProperty(id, userId)) {
        throw new ForbiddenException(
          'You are not allowed to update this place',
        );
      }

      const updatedPlace = this.prisma.place.update({
        where: { id },
        data: {
          ...updatePlaceDto,
        },
      });

      return updatedPlace;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  async remove(id: number, userId: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (
        user.role !== UserRole.ADMIN &&
        user.role !== UserRole.WORKER &&
        !this.checkPlaceProperty(id, userId)
      ) {
        throw new ForbiddenException(
          'You are not allowed to delete this place',
        );
      }

      return { message: 'Place deleted successfully' };
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  private checkPlaceProperty(placeId: number, userId: number) {
    const place = this.prisma.place.findFirst({
      where: {
        id: placeId,
        userId: userId,
      },
    });

    return place;
  }
}
