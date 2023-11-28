import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IGrantedAccess } from './interfaces/Igranted-access';
import { AuthDto, RegisterDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async getMyInfo(userId: number): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
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
            photoUrl: true,
            birthDay: true,
            address: true,
            companyName: true,
            ruc: true,
            personalId: true,
          },
        },
        BankAccount: {
          select: {
            bank: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('No estas logueado');
    }

    return user;
  }

  async login(authDto: AuthDto): Promise<IGrantedAccess> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: authDto.username,
      },
      include: {
        UserInfo: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }

    const passwordMatch = await argon.verify(user.password, authDto.password);

    if (!passwordMatch) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }

    const token = await this.signToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.UserInfo[0].name,
        lastname: user.UserInfo[0].lastname,
        phone: user.UserInfo[0].phone,
        photoUrl: user.UserInfo[0].photoUrl,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<IGrantedAccess> {
    if (registerDto.password !== registerDto.repeatPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const hashedPassword = await argon.hash(registerDto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        role:
          registerDto.ruc && registerDto.companyName
            ? UserRole.CORPORATIVE_USER
            : UserRole.USER,
        UserInfo: {
          create: {
            name: registerDto.name,
            lastname: registerDto.lastName,
            phone: registerDto.phone,
            address: registerDto.address,
            personalId: registerDto.dni || null,
            photoUrl: getAvatarUrl(registerDto.name, registerDto.lastName),
            ruc: registerDto.ruc || null,
            companyName: registerDto.companyName || null,
            birthDay: registerDto.birthDay || null,
          },
        },
      },
      include: {
        UserInfo: true,
      },
    });

    const token = await this.signToken(newUser.id, newUser.email);
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        name: newUser.UserInfo[0].name,
        lastname: newUser.UserInfo[0].lastname,
        phone: newUser.UserInfo[0].phone,
        photoUrl: newUser.UserInfo[0].photoUrl,
        role: UserRole.USER,
      },
    };
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRATION'),
      secret: secret,
    });

    return token;
  }
}

export function getAvatarUrl(name: string, lastName: string) {
  return `https://ui-avatars.com/api/?name=${name}+${lastName}&background=random&length=1&size=524`;
}
