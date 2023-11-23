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
import { Place, PlaceStatus, UserRole } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CRUDPrismaCatchError } from 'src/common/utils/catchErrorsUtils';
import { FilterPublicPlaces } from './dto/filter-public-places';
import { CloudinaryService } from 'src/common/services';

@Injectable()
export class PlaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  private readonly logger = new Logger(PlaceService.name);

  async deletePhoto(idPhoto: number, userId: number) {
    const photo = await this.prisma.placePhoto.findFirst({
      where: {
        id: idPhoto,
      },
      select: {
        place: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.place.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this photo');
    }

    await this.prisma.placePhoto.delete({
      where: {
        id: idPhoto,
      },
    });

    return { message: 'Photo deleted successfully' };
  }

  async uploadPhotoToPlace(
    idPlace: number,
    photo: Express.Multer.File,
    userId: number,
  ) {
    const place = await this.prisma.place.findFirst({
      where: {
        id: idPlace,
      },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    if (place.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to upload a photo to this place',
      );
    }

    const uploadedPhoto = await this.cloudinary.upload(photo);

    const newPhoto = await this.prisma.placePhoto.create({
      data: {
        idPlace: idPlace,
        photoUrl: uploadedPhoto.secure_url,
      },
    });

    return newPhoto;
  }

  async verifyPlace(idPlace: number, status: PlaceStatus) {
    const place = await this.prisma.place.findFirst({
      where: {
        id: idPlace,
        status: PlaceStatus.REVIEW,
      },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    const updatedPlace = await this.prisma.place.update({
      where: { id: idPlace },
      data: {
        status: status,
      },
    });

    return updatedPlace;
  }

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
        pricePerHour: createPlaceDto.pricePerHour,
        capacity: createPlaceDto.capacity,
        categoryId: createPlaceDto.categoryId,
        userId: user.id,
        departmentId: createPlaceDto.departmentId,
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

    return newPlace;
  }

  async count(filterPlaceDto: FilterPlaceDto, userId: number) {
    const { search = '' } = filterPlaceDto;

    return this.prisma.place.count({
      where: {
        isActive: true,
        name: {
          contains: search,
          mode: 'insensitive',
        },
        categoryId: filterPlaceDto.category,
        departmentId: filterPlaceDto.department,
        pricePerHour: {
          gte: filterPlaceDto.minPrice || 0,
          lte: filterPlaceDto.maxPrice || 99999,
        },
        capacity: {
          lte: filterPlaceDto.capacity || 99999,
        },
        status: filterPlaceDto.status || PlaceStatus.APPROVED,
        userId: filterPlaceDto.myPlaces ? userId : undefined,
      },
    });
  }

  async findAll(
    filterPlaceDto: FilterPlaceDto,
    pagination: PaginationDto,
    userId: number,
  ) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (user.role === UserRole.CORPORATIVE_USER && !filterPlaceDto.myPlaces) {
        throw new ForbiddenException('You are not allowed to see all places');
      }

      const places = await this.prisma.place.findMany({
        take: pagination.limit || undefined,
        skip: pagination.offset || undefined,
        where: {
          name: {
            contains: filterPlaceDto.search || '',
            mode: 'insensitive',
          },
          categoryId: filterPlaceDto.category,
          departmentId: filterPlaceDto.department,
          pricePerHour: {
            gte: filterPlaceDto.minPrice || 0,
            lte: filterPlaceDto.maxPrice || 99999,
          },
          capacity: {
            lte: filterPlaceDto.capacity || 99999,
          },
          status: filterPlaceDto.status || PlaceStatus.APPROVED,
          userId: filterPlaceDto.myPlaces ? userId : undefined,
        },
        include: {
          Photos: {
            select: {
              id: true,
              photoUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          PlaceService: {
            select: {
              service: {
                select: {
                  name: true,
                  iconUrl: true,
                },
              },
              price: true,
            },
          },
        },
      });

      return places;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  async countAllPublic(filterPlaceDto: FilterPublicPlaces): Promise<number> {
    return this.prisma.place.count({
      where: {
        name: {
          contains: filterPlaceDto.search || '',
          mode: 'insensitive',
        },
        categoryId: filterPlaceDto.category,
        departmentId: filterPlaceDto.department,
        pricePerHour: {
          gte: filterPlaceDto.minPrice || 0,
          lte: filterPlaceDto.maxPrice || 99999,
        },
        capacity: {
          lte: filterPlaceDto.capacity || 99999,
        },
        status: PlaceStatus.APPROVED,
        isActive: true,
      },
    });
  }

  async findAllPublic(
    filterPlaceDto: FilterPublicPlaces,
    pagination: PaginationDto,
  ): Promise<Partial<Place>[]> {
    const places = await this.prisma.place.findMany({
      take: pagination.limit || undefined,
      skip: pagination.offset || undefined,
      where: {
        name: {
          contains: filterPlaceDto.search || '',
          mode: 'insensitive',
        },
        categoryId: filterPlaceDto.category,
        departmentId: filterPlaceDto.department,
        pricePerHour: {
          gte: filterPlaceDto.minPrice || 0,
          lte: filterPlaceDto.maxPrice || 99999,
        },
        capacity: {
          lte: filterPlaceDto.capacity || 99999,
        },
        status: PlaceStatus.APPROVED,
      },
      select: {
        id: true,
        name: true,
        pricePerHour: true,
        department: {
          select: {
            name: true,
          },
        },
        capacity: true,
        Photos: {
          select: {
            photoUrl: true,
          },
        },
        PlaceService: {
          select: {
            service: {
              select: {
                name: true,
                iconUrl: true,
              },
            },
          },
        },
      },
    });

    return places;
  }

  async findOne(id: number) {
    try {
      const place = this.prisma.place.findUnique({
        where: { id },

        select: {
          id: true,
          name: true,
          description: true,
          Photos: {
            select: {
              id: true,
              photoUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          capacity: true,
          pricePerHour: true,
          user: {
            select: {
              id: true,
              email: true,
              UserInfo: {
                select: {
                  name: true,
                  lastname: true,
                  phone: true,
                  photoUrl: true,
                },
              },
            },
          },
          PlaceService: {
            select: {
              service: {
                select: {
                  name: true,
                  iconUrl: true,
                },
              },
              price: true,
            },
          },
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

  async update(id: number, updatePlaceDto: UpdatePlaceDto, userId: number) {
    try {
      if (!this.checkPlaceProperty(id, userId)) {
        throw new ForbiddenException(
          'You are not allowed to update this place',
        );
      }

      const updatedPlace = await this.prisma.place.update({
        where: { id },
        data: {
          ...updatePlaceDto,
          PlaceService: {
            deleteMany: {
              placeId: id,
            },
            createMany: {
              data: updatePlaceDto.services.map((service) => ({
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
