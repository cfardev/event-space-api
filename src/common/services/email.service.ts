import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_SERVER'),
      port: Number(this.config.get('SMTP_PORT')),
      secure: true,
      auth: {
        user: this.config.get('SMTP_USERNAME'),
        pass: this.config.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    body: string,
    attachments: Atachment[] = [],
  ) {
    const mailOptions = {
      from: this.config.get('EMAIL_ADDRESS'),
      to: to,
      subject,
      html: body,
      attachments,
    };
    await this.transporter.sendMail(mailOptions);
  }
}

type Atachment = {
  filename: string;
  content: any;
};
