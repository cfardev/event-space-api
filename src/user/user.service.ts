import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { CRUDPrismaCatchError } from 'src/common/utils/catchErrorsUtils';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UserService.name);

  async findAll(pagination: PaginationDto, filter: FilterUserDto) {
    const users = await this.prisma.user.findMany({
      select: {
        username: true,
        email: true,
        role: true,
        UserInfo: {
          select: {
            name: true,
            lastname: true,
            phone: true,
            birthDay: true,
            address: true,
            companyName: true,
            ruc: true,
            personalId: true,
          },
        },
        _count: {
          select: {
            Place: true,
            Reservation: true,
          },
        },
      },
      where: {
        isActive: true,
        role: filter.role || undefined,
        UserInfo: {
          some: {
            name: {
              contains: filter.search || undefined,
              mode: 'insensitive',
            },
          },
        },
      },
      skip: pagination.offset || undefined,
      take: pagination.limit || undefined,
    });

    return users;
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id,
        },
        include: {
          UserInfo: true,
        },
      });

      delete user.password;

      return user;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      const userToUpdate = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          UserInfo: true,
        },
      });

      if (
        (user.role !== UserRole.ADMIN && id !== user.id) ||
        (user.role === UserRole.ADMIN &&
          userToUpdate.role !== UserRole.WORKER &&
          user.role === UserRole.ADMIN)
      ) {
        throw new ForbiddenException(
          'No tienes permisos para actualizar ese usuario',
        );
      }

      const updatedUser = await this.prisma.userInfo.update({
        where: {
          id: userToUpdate.UserInfo[0].id,
        },
        data: {
          name: updateUserDto.name,
          lastname: updateUserDto.lastname,
          phone: updateUserDto.phone,
          birthDay: updateUserDto.birthDay,
          address: updateUserDto.address,
          companyName: updateUserDto.companyName,
          ruc: updateUserDto.ruc,
          personalId: updateUserDto.personalId,
        },
      });

      return updatedUser;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  remove(id: number) {
    this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    return { message: 'User deleted successfully' };
  }
}
