import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: 'deymfl4hm',
      api_key: '768886368258866',
      api_secret: 'XX8dyZUU3g9h_fl5IrtqKkPBnUU',
    });
  }

  upload(file: Express.Multer.File): Promise<CloudinaryRespone> {
    return new Promise<CloudinaryRespone>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);

          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async delete(publicId: string): Promise<any> {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export type CloudinaryRespone = UploadApiResponse | UploadApiErrorResponse;
