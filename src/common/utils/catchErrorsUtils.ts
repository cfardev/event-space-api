import {
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaHandleError } from '../../prisma/utils/prisma-handle-error';

export function CRUDPrismaCatchError(error: any, logger: Logger) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(error.message);
    prismaHandleError(error);
  } else if (error.status === 403) {
    throw new ForbiddenException(error.message);
  } else if (error.status === 404) {
    throw new NotFoundException(error.message);
  } else if (error.status === 401) {
    throw new ForbiddenException(error.message);
  }

  logger.error(error.message);
  throw new InternalServerErrorException(error.message);
}
