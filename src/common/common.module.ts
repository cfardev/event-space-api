import { Global, Module } from '@nestjs/common';
import { CloudinaryService, EmailService, PDFService } from './services';

@Global()
@Module({
  exports: [PDFService, EmailService, CloudinaryService],
  providers: [PDFService, EmailService, CloudinaryService],
})
export class CommonModule {}
