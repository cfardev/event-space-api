import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PDFService {
  async createPDF(htmlContent, pdfOptions) {
    const browser = await puppeteer.launch({
      headless: true,
      ignoreDefaultArgs: ['--disable-extensions'],
      args: ['--no-sandbox', '--use-gl=egl', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    );
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf(pdfOptions);
    await browser.close();

    const fileName = `${new Date().getUTCSeconds()}.pdf`;

    const file = {
      fieldname: 'pdf',
      originalname: fileName,
      mimetype: 'application/pdf',
      buffer: pdfBuffer,
      size: pdfBuffer.length,
    };

    return file;
  }
}
