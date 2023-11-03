import { Injectable } from '@nestjs/common';
import * as pdf from 'html-pdf';

@Injectable()
export class PDFService {
  async createPDF(htmlContent, pdfOptions) {
    return new Promise((resolve, reject) => {
      pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          // Generar un nombre de archivo único utilizando uuidv4
          const fileName = `${new Date().getUTCSeconds()}.pdf`;

          // Crear un objeto de archivo simulado
          const file = {
            fieldname: 'pdf',
            originalname: fileName,
            mimetype: 'application/pdf',
            buffer: buffer,
            size: buffer.length,
          };
          resolve(file);
        }
      });
    });
  }
}
