import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { FilterReservationDto, VerifyDisponibilityDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { billTemp } from './templates/code/bill';
import { EmailService, PDFService } from 'src/common/services';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Reservation, UserRole } from '@prisma/client';
import * as moment from 'moment';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdf: PDFService,
    private readonly email: EmailService,
  ) {}

  private async getTotalPayment(
    placeId: number,
    services: number[],
    endDate: Date,
    startDate: Date,
  ) {
    const totalHours = (endDate.getTime() - startDate.getTime()) / 3600000;

    const place = await this.prisma.place.findUnique({
      where: {
        id: placeId,
      },
    });

    let subTotal = place.pricePerHour * totalHours;

    const servicesData = await this.prisma.placeService.findMany({
      where: {
        placeId: placeId,
        id: {
          in: services,
        },
        isActive: true,
      },
    });

    servicesData.forEach((service) => {
      subTotal += service.price;
    });

    return {
      subTotal: Number(subTotal.toFixed(2)),
      IVA: Number((subTotal * 0.15).toFixed(2)),
      serviceTax: Number((subTotal * 0.05).toFixed(2)),
      total: Number((subTotal * 1.2).toFixed(2)),
      totalHours: totalHours,
    };
  }

  async verifyDisponibility(verifyDisponibilityDto: VerifyDisponibilityDto) {
    const conflict = await this.prisma.reservation.findMany({
      where: {
        placeId: verifyDisponibilityDto.placeId,
        startTime: {
          lte: verifyDisponibilityDto.endDate,
        },
        endTime: {
          gte: verifyDisponibilityDto.startDate,
        },
      },
    });

    if (conflict.length > 0) {
      return false;
    }

    return true;
  }

  async create(createReservationDto: CreateReservationDto, userId: number) {
    const isAvailable = await this.verifyDisponibility(createReservationDto);

    if (!isAvailable) {
      throw new BadRequestException(
        'The place is not available for the selected dates',
      );
    }

    const payment = await this.getTotalPayment(
      createReservationDto.placeId,
      createReservationDto.services,
      createReservationDto.endDate,
      createReservationDto.startDate,
    );

    const reservation = await this.prisma.reservation.create({
      data: {
        place: {
          connect: {
            id: createReservationDto.placeId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        startTime: createReservationDto.startDate,
        endTime: createReservationDto.endDate,
        reservationDate: new Date(),
        isConfirmed: true,
        bill: {
          create: {
            subTotal: payment.subTotal,
            iva: payment.IVA,
            serviceTax: payment.serviceTax,
            total: payment.total,
            Payment: {
              create: {
                referenceCode: generateReferenceCode(),
                cardNumber: createReservationDto.creditCardNumber,
                fullName: createReservationDto.paymentName,
              },
            },
          },
        },
        PlaceServiceReservation: {
          createMany: {
            data: createReservationDto.services.map((serviceId) => {
              return {
                placeServiceId: serviceId,
              };
            }),
          },
        },
      },

      include: {
        bill: {
          include: {
            Payment: true,
          },
        },
        user: {
          include: {
            UserInfo: true,
          },
        },
        place: true,
        PlaceServiceReservation: {
          include: {
            placeService: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });

    await this.sendBillEmail(reservation, payment.totalHours);

    return reservation;
  }

  async count(
    filterReservationDto: FilterReservationDto,
    userId: number,
  ): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user.role === UserRole.USER) {
      filterReservationDto.reservatorId = userId;
    }

    if (
      user.role === UserRole.CORPORATIVE_USER &&
      !filterReservationDto.hostId &&
      !filterReservationDto.reservatorId
    ) {
      throw new BadRequestException(
        `As corporative user you need to specify hostId or reservatorId`,
      );
    }

    const { dateEndDay = null, dateStartDay = null } = getStartAndEndOfDayUTC(
      filterReservationDto.date,
    );

    const reservations = await this.prisma.reservation.count({
      where: {
        userId: filterReservationDto.reservatorId || undefined,
        OR: [
          {
            place: {
              user: {
                UserInfo: {
                  some: {
                    name: {
                      contains: filterReservationDto.search || '',
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
          },
          {
            place: {
              name: {
                contains: filterReservationDto.search || '',
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              UserInfo: {
                some: {
                  name: {
                    contains: filterReservationDto.search || '',
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
        reservationDate: filterReservationDto.date
          ? {
              gte: dateStartDay || undefined,
              lte: dateEndDay || undefined,
            }
          : undefined,
        place: {
          categoryId: filterReservationDto.categoryId || undefined,
          userId: filterReservationDto.hostId || undefined,
        },
      },
    });

    return reservations;
  }

  async findAll(
    filterReservationDto: FilterReservationDto,
    pagination: PaginationDto,
    userId: number,
  ): Promise<Partial<Reservation>[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user.role === UserRole.USER) {
      filterReservationDto.reservatorId = userId;
    }

    if (
      user.role === UserRole.CORPORATIVE_USER &&
      !filterReservationDto.hostId &&
      !filterReservationDto.reservatorId
    ) {
      throw new BadRequestException(
        `As corporative user you need to specify hostId or reservatorId`,
      );
    }

    const { dateEndDay = null, dateStartDay = null } = getStartAndEndOfDayUTC(
      filterReservationDto.date,
    );

    const reservations = await this.prisma.reservation.findMany({
      take: pagination.limit || undefined,
      skip: pagination.offset || undefined,
      where: {
        userId: filterReservationDto.reservatorId || undefined,
        OR: [
          {
            place: {
              user: {
                UserInfo: {
                  some: {
                    name: {
                      contains: filterReservationDto.search || '',
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
          },
          {
            place: {
              name: {
                contains: filterReservationDto.search || '',
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              UserInfo: {
                some: {
                  name: {
                    contains: filterReservationDto.search || '',
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
        reservationDate: filterReservationDto.date
          ? {
              gte: dateStartDay || undefined,
              lte: dateEndDay || undefined,
            }
          : undefined,
        place: {
          categoryId: filterReservationDto.categoryId || undefined,
          userId: filterReservationDto.hostId || undefined,
        },
      },
      select: {
        id: true,
        reservationDate: true,
        place: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                UserInfo: {
                  select: {
                    name: true,
                    lastname: true,
                  },
                },
              },
            },
          },
        },
        startTime: true,
        endTime: true,
        bill: {
          select: {
            id: true,
            subTotal: true,
            iva: true,
            serviceTax: true,
            total: true,
            Payment: {
              select: {
                id: true,
                referenceCode: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            UserInfo: {
              select: {
                name: true,
                lastname: true,
              },
            },
          },
        },
        PlaceServiceReservation: {
          select: {
            placeService: {
              select: {
                service: {
                  select: {
                    iconUrl: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        isConfirmed: true,
        isActive: true,
      },
      orderBy: {
        reservationDate: 'desc',
      },
    });

    return reservations;
  }

  async remove(id: number, userId: number) {
    //Verify if the reservation dont excend 24 hours
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        id: id,
        isActive: true,
      },
      include: {
        user: {
          include: {
            UserInfo: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (
      reservation.reservationDate.getTime() - new Date().getTime() >
      86400000
    ) {
      throw new BadRequestException(
        'You can only cancel reservations 24 hours before the reservation date',
      );
    }

    //Chech if the user is the owner of the reservation

    if (reservation.userId !== userId) {
      throw new BadRequestException(
        'You can only cancel your own reservations',
      );
    }

    await this.prisma.reservation.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
      },
    });

    await this.email.sendEmail(
      reservation.user.email,
      'Reservación cancelada',
      `Hola ${reservation.user.UserInfo[0].name} ${reservation.user.UserInfo[0].lastname},<br> Tu reservación ha sido cancelada. Gracias por utilizar EventSpace!`,
    );

    return { message: 'Reservation canceled' };
  }

  private async sendBillEmail(reservation, totalHours: number) {
    const emailBody = `Hola ${reservation.user.UserInfo[0].name} ${reservation.user.UserInfo[0].lastname},<br> Te enviamos la factura electrónica de tu reserva. Gracias por utilizar EventSpace!}`;

    const placeServices = reservation.PlaceServiceReservation.map(
      (placeService) => {
        return {
          serviceName: placeService.placeService.service.name,
          price: placeService.placeService.price,
        };
      },
    );

    const billHTML = billTemp(
      reservation.user.UserInfo[0],
      reservation.user.email,
      reservation.place,
      placeServices,
      reservation.bill,
      reservation.bill.Payment,
      totalHours,
      reservation,
    );

    const pdf: any = await this.pdf.createPDF(billHTML, {
      format: 'Letter',
      childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
      },
    });

    await this.email.sendEmail(
      reservation.user.email,
      'Factura de reserva',
      emailBody,
      [
        {
          filename: 'Factura.pdf',
          content: Buffer.from(pdf.buffer, 'base64'),
        },
      ],
    );
  }
}

function generateReferenceCode() {
  return Math.floor(Math.random() * 1000000000).toString();
}

function getStartAndEndOfDayUTC(dateInUTCMinus6) {
  // Convert the provided date to a Moment.js object
  const dateInUTCMinus6Moment = moment(dateInUTCMinus6).utcOffset('-06:00');

  // Start of the day in UTC
  const startOfDayUTC = dateInUTCMinus6Moment.clone().startOf('day');

  // End of the day in UTC
  const endOfDayUTC = dateInUTCMinus6Moment.clone().endOf('day');

  return {
    dateStartDay: startOfDayUTC.format(),
    dateEndDay: endOfDayUTC.format(),
  };
}
