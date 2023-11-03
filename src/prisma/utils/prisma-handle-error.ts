import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const prismaHandleError = (
  error: Prisma.PrismaClientKnownRequestError,
) => {
  const logger = new Logger('PrismaError');

  switch (error.code) {
    case 'P2000':
      throw new BadRequestException(
        `El valor proporcionado para la columna es demasiado largo para el tipo de columna. Columna: ${error.meta.target}`,
      );
    case 'P2001':
      throw new NotFoundException(
        `El registro buscado en la condición where (${error.meta.target}) no existe.`,
      );
    case 'P2002':
      throw new ConflictException(
        `Error de restricción única en ${error.meta.target}.`,
      );
    case 'P2003':
      throw new BadRequestException(
        `Error de restricción de clave externa en el campo: ${error.meta.field_name}.`,
      );
    case 'P2004':
      throw new InternalServerErrorException(
        `Error de restricción en la base de datos: ${error.meta.target}.`,
      );
    case 'P2005':
      throw new BadRequestException(
        `El valor ${error.meta.target} almacenado en la base de datos para el campo ${error.meta.target} no es válido para el tipo de campo.`,
      );
    case 'P2006':
      throw new BadRequestException(
        `El valor proporcionado ${error.meta.target} para el campo ${error.meta.target} de ${error.meta.target} no es válido.`,
      );
    case 'P2007':
      throw new BadRequestException(
        `Error de validación de datos ${error.meta.target}`,
      );
    case 'P2008':
      throw new BadRequestException(
        `Error al analizar la consulta ${error.meta.target} en ${error.meta.target}`,
      );
    case 'P2009':
      throw new BadRequestException(
        `Error al validar la consulta: ${error.meta.target} en ${error.meta.target}`,
      );
    case 'P2010':
      throw new InternalServerErrorException(
        `Falló la consulta en crudo. Código: ${error.meta.code}. Mensaje: ${error.meta.message}`,
      );
    case 'P2011':
      throw new BadRequestException(
        `Violación de restricción de nulidad en ${error.meta.target}`,
      );
    case 'P2012':
      throw new BadRequestException(
        `Falta un valor requerido en ${error.meta.target}`,
      );
    case 'P2013':
      throw new BadRequestException(
        `Falta el argumento requerido ${error.meta.target} para el campo ${error.meta.target} en ${error.meta.target}.`,
      );
    case 'P2014':
      throw new BadRequestException(
        `El cambio que estás intentando hacer violaría la relación requerida '${error.meta.target}' entre los modelos ${error.meta.target} y ${error.meta.target}.`,
      );
    case 'P2015':
      throw new NotFoundException(
        `No se pudo encontrar un registro relacionado. ${error.meta.target}`,
      );
    case 'P2016':
      throw new BadRequestException(
        `Error de interpretación de consulta. ${error.meta.target}`,
      );
    case 'P2017':
      throw new BadRequestException(
        `Los registros de la relación ${error.meta.target} entre los modelos ${error.meta.target} y ${error.meta.target} no están conectados.`,
      );
    case 'P2018':
      throw new NotFoundException(
        `No se encontraron los registros conectados requeridos. ${error.meta.target}`,
      );
    case 'P2019':
      throw new BadRequestException(`Error de entrada. ${error.meta.target}`);
    case 'P2020':
      throw new BadRequestException(
        `Valor fuera de rango para el tipo. ${error.meta.target}`,
      );
    case 'P2021':
      throw new NotFoundException(
        `La tabla ${error.meta.target} no existe en la base de datos actual.`,
      );
    case 'P2022':
      throw new NotFoundException(
        `La columna ${error.meta.column} no existe en la base de datos.`,
      );
    case 'P2023':
      throw new InternalServerErrorException(
        `Los datos en la columna son inconsistentes: ${error.meta.message}`,
      );
    case 'P2024':
      throw new InternalServerErrorException(
        `No se pudo obtener una nueva conexión de la pool de conexiones en el tiempo de espera. (Más información: ${error.meta.connectionPoolLink} (Tiempo de espera actual de la pool de conexiones: ${error.meta.timeout}, límite de conexiones: ${error.meta.connectionLimit}))`,
      );
    case 'P2025':
      throw new NotFoundException(
        `La operación falló porque depende de uno o más registros que son necesarios pero no se encontraron: ${error.meta.cause}`,
      );
    case 'P2026':
      throw new BadRequestException(
        `El proveedor de base de datos actual no admite una función que se utilizó en la consulta: ${error.meta.feature}`,
      );
    case 'P2027':
      throw new InternalServerErrorException(
        `Ocurrieron múltiples errores en la base de datos durante la ejecución de la consulta: ${error.meta.errors}`,
      );
    case 'P2028':
      throw new InternalServerErrorException(
        `Error de la API de transacciones: ${error.meta.error}`,
      );
    case 'P2030':
      throw new BadRequestException(
        `No se pudo encontrar un índice de texto completo para usar en la búsqueda. Intenta agregar un @@fulltext([Campos...]) en tu esquema.`,
      );
    case 'P2031':
      throw new InternalServerErrorException(
        `Prisma necesita realizar transacciones, lo que requiere que tu servidor de MongoDB se ejecute como un conjunto de réplicas. Ver detalles: ${error.meta.mongodbReplicaSetLink}`,
      );
    case 'P2033':
      throw new BadRequestException(
        `El número utilizado en la consulta no cabe en un entero firmado de 64 bits. Considera usar BigInt como tipo de campo si estás intentando almacenar números grandes.`,
      );
    case 'P2034':
      throw new InternalServerErrorException(
        `La transacción falló debido a un conflicto de escritura o un bloqueo. Por favor, reintenta tu transacción.`,
      );
    default:
      logger.error(error.message);
      throw new InternalServerErrorException(error.message);
  }
};
