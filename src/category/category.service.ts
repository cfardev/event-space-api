import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CRUDPrismaCatchError } from 'src/common/utils/catchErrorsUtils';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(CategoryService.name);

  create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = this.prisma.category.create({
        data: {
          ...createCategoryDto,
        },
      });

      return newCategory;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  async count() {
    try {
      const count = await this.prisma.category.count({
        where: {
          isActive: true,
        },
      });

      return count;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      const { offset = 0, limit = 10 } = pagination;

      const categories = await this.prisma.category.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          isActive: true,
        },
      });

      return categories;
    } catch (error) {}
  }

  findOne(id: number) {
    try {
      const category = this.prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return category;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updatedCategory = this.prisma.category.update({
        where: { id },
        data: {
          ...updateCategoryDto,
        },
      });

      return updatedCategory;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.category.update({
        where: { id },
        data: { isActive: false },
      });

      return { message: 'Category deleted successfully' };
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }
}
