import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/common/services';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Service } from '@prisma/client';
import { CRUDPrismaCatchError } from 'src/common/utils/catchErrorsUtils';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  private readonly logger = new Logger(ServiceService.name);

  async create(
    createServiceDto: CreateServiceDto,
    icon: Express.Multer.File,
  ): Promise<Service> {
    if (!icon) {
      throw new BadRequestException('Icon is required');
    }

    try {
      const iconUploaded = await this.cloudinary.upload(icon);

      const newService = this.prisma.service.create({
        data: {
          ...createServiceDto,
          iconUrl: iconUploaded.secure_url,
        },
      });

      return newService;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  findAll(pagination: PaginationDto): Promise<Service[]> {
    try {
      const { limit, offset } = pagination;

      return this.prisma.service.findMany({
        take: limit,
        skip: offset,

        where: {
          isActive: true,
        },
      });
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  async findOne(id: number): Promise<Service> {
    try {
      const service = await this.prisma.service.findFirst({
        where: {
          id,
          isActive: true,
        },
      });

      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }

      return service;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    icon: Express.Multer.File,
  ) {
    if (!icon) {
      throw new BadRequestException('Icon is required');
    }

    const iconUploaded = await this.cloudinary.upload(icon);

    const updatedService = this.prisma.service.update({
      where: {
        id,
      },
      data: {
        ...updateServiceDto,
        iconUrl: iconUploaded.secure_url,
      },
    });

    return updatedService;
  }

  remove(id: number) {
    return this.prisma.service.updateMany({
      where: {
        id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }
}