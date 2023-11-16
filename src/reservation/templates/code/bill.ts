import { Bill, Payment, Place, Reservation, UserInfo } from '@prisma/client';
import * as moment from 'moment';

moment.locale('es');

export const billTemp = (
  userInfo: UserInfo,
  email: string,
  place: Place,
  placeServices: {
    serviceName: string;
    price: number;
  }[],
  bill: Bill,
  payment: Payment,
  totalHours: number,
  reservation: Reservation,
) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    />
    <title>Factura Electrónica</title>
  </head>
  <body class="font-sans bg-gray-100">
    <div class="container mx-auto p-8">
      <!-- Encabezado de la factura -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Factura Electrónica</h1>
        <p class="text-gray-600">Fecha: ${moment(new Date()).format(
          'D [de] MMMM [de] YYYY',
        )}</p>
      </div>

      <div class="flex justify-center my-5">
        <span class="text-blue-600 text-xl font-bold mt-8">EventSpace</span>
        <br />
      </div>

      <!-- Detalles del cliente -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-2">Detalles del Cliente</h2>
        <p>Nombre del Cliente: ${userInfo.name} ${userInfo.lastname}</p>
        <p>Dirección: ${userInfo.address}</p>
        <p>Email: ${email} </p>
        <br />
        <p class="font-bold">Datos de la reserva</p>
        <p>Fecha de inicio: ${moment(reservation.startTime).format(
          'D [de] MMMM [de] YYYY [a las] h:mm a',
        )} </p>
        <p>Fecha de fin: ${moment(reservation.startTime).format(
          'D [de] MMMM [de] YYYY [a las] h:mm a',
        )} </p>
      </div>

      <!-- Detalles de los productos/servicios -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Productos/Servicios</h2>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="p-2">Descripción</th>
              <th class="p-2">Cantidad</th>
              <th class="p-2">Precio Unitario</th>
              <th class="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <!-- Fila de ejemplo, puedes replicarla según sea necesario -->
            <tr>
              <td class="p-2 text-center">Lugar: ${place.name} - Hora</td>
              <td class="p-2 text-center">${totalHours}</td>
              <td class="p-2 text-center">C$${Number(
                place.pricePerHour.toFixed(2),
              )}</td>
              <td class="p-2 text-center">C$${Number(
                (place.pricePerHour * totalHours).toFixed(2),
              )}</td>
            </tr>

            ${placeServices.map(
              (ps) => `
            <tr>
              <td class="p-2 text-center">Servicio: ${ps.serviceName}</td>
              <td class="p-2 text-center">1</td>
              <td class="p-2 text-center">C$ ${Number(ps.price.toFixed(2))}</td>
              <td class="p-2 text-center">C$ ${Number(ps.price.toFixed(2))}</td>
            </tr>
            `,
            )}
            <!-- Otras filas de productos/servicios aquí -->
          </tbody>
        </table>
      </div>

      <!-- Total y detalles de pago -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-2">Resumen de Pago</h2>
        <p class="mb-2">Nombre: ${payment.fullName}</p>
        <p class="mb-2">No. de referencia: ${payment.referenceCode}</p>
        <p class="mb-2">Subtotal: C$ ${bill.subTotal}</p>
        <p class="mb-2">Impuestos (IVA): C$ ${bill.iva}</p>
        <p class="mb-2">Tarifa de servicio: C$ ${bill.serviceTax}</p>
        <p class="text-2xl font-bold">Total: C$ ${bill.total}</p>
      </div>

      
    </div>
  </body>
</html>
    `;
};
