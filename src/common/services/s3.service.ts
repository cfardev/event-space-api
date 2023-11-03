import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uid } from 'uuid';

@Injectable()
export class S3Service {
  constructor(private readonly config: ConfigService) {}
  private readonly logger = new Logger(S3Service.name);

  private s3 = new S3({
    accessKeyId: this.config.get('AWS_KEY_ID'),
    secretAccessKey: this.config.get('AWS_KEY_SECRET'),
  });

  async uploadFile(file: any, folderName: string) {
    try {
      const params = {
        Bucket: this.config.get('BUCKET_NAME'),
        Key: `${folderName}/${uid()}.${file.mimetype.split('/')[1]}`,
        Body: file.buffer,
        ACL: 'public-read',
      };

      const res = await this.s3.upload(params).promise();
      this.logger.log('File uploaded, url: ' + res.Location);
      return res.Location;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error con el servicio de S3, por favor contacta con el desarrollador',
      );
    }
  }

  async getFile(fileName: string) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.config.get('BUCKET_NAME'),
        Key: fileName,
      };

      this.s3.getObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Body);
        }
      });
    });
  }

  async deleteFile(urlImg: string) {
    try {
      const params = {
        Bucket: this.config.get('BUCKET_NAME'),
        Key: this.extractFilePath(urlImg),
      };

      await this.s3.deleteObject(params).promise();
      this.logger.log('File deleted, key: ' + this.extractFilePath(urlImg));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error con el servicio de S3, por favor contacta con el desarrollador',
      );
    }
  }

  extractFilePath(url: string): string {
    const regex = /https:\/\/[\w-]+\.s3\.amazonaws\.com\/(.*)/;
    const result = regex.exec(url);
    return result ? result[1] : '';
  }
}
