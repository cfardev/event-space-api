import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { CRUDPrismaCatchError } from 'src/common/utils/catchErrorsUtils';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { CloudinaryService, EmailService } from 'src/common/services';
import { CreateUserDto } from './dto/create-user.dto';
import { getAvatarUrl } from 'src/auth/auth.service';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly emailService: EmailService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordGenerated = generatePassword();
      const hashedPassword = await argon.hash(passwordGenerated);
      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: hashedPassword,
          role: UserRole.WORKER,
          UserInfo: {
            create: {
              name: createUserDto.name,
              lastname: createUserDto.lastname,
              phone: createUserDto.phone,
              birthDay: createUserDto.birthDay,
              address: createUserDto.address,
              companyName: createUserDto.companyName,
              ruc: createUserDto.ruc,
              personalId: createUserDto.personalId,
              photoUrl: getAvatarUrl(
                createUserDto.username,
                createUserDto.lastname,
              ),
            },
          },
        },
        include: {
          UserInfo: true,
        },
      });

      await this.emailService.sendEmail(
        user.email,
        'Bienvenido al equipo de EventSpace',
        `Hola ${user.UserInfo[0].name} ${user.UserInfo[0].lastname}, te damos la bienvenida a EventSpace, tu usuario es ${user.username} y tu contraseña es ${passwordGenerated}`,
      );

      await delete user.password;

      return user;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  async count(filter: FilterUserDto) {
    const count = await this.prisma.user.count({
      where: {
        isActive: true,
        role: filter.roles ? { in: filter.roles } : undefined,
        UserInfo: {
          some: {
            name: {
              contains: filter.search || undefined,
              mode: 'insensitive',
            },
          },
        },
      },
    });

    return count;
  }

  async findAll(pagination: PaginationDto, filter: FilterUserDto) {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
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
            photoUrl: true,
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
        role: filter.roles ? { in: filter.roles } : undefined,
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

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    userId: number,
    avatar: Express.Multer.File,
  ) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      const userToUpdate = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
        include: {
          UserInfo: true,
        },
      });

      if (
        (user.role !== UserRole.ADMIN && id !== user.id) ||
        (user.role === UserRole.ADMIN &&
          userToUpdate.role !== UserRole.WORKER &&
          user.role === UserRole.ADMIN &&
          userToUpdate.role !== UserRole.ADMIN)
      ) {
        throw new ForbiddenException(
          'No tienes permisos para actualizar ese usuario',
        );
      }

      let avatarFile = userToUpdate.UserInfo[0].photoUrl;

      if (avatar) {
        avatarFile = (await this.cloudinary.upload(avatar)).secure_url;
      }

      const updatedUser = await this.prisma.userInfo.updateMany({
        where: {
          userId: id,
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
          photoUrl: avatarFile,
        },
      });

      return updatedUser;
    } catch (error) {
      CRUDPrismaCatchError(error, this.logger);
    }
  }

  async remove(id: number) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('You cannot delete an admin user');
    }

    return { message: 'User deleted successfully' };
  }
}

function generatePassword() {
  const length = 8,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
