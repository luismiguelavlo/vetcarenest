import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  private readonly logger = new Logger('FilesService');
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly userService: UserService) {
    this.s3Client = new S3Client({
      region: envs.aws_region,
      credentials: {
        accessKeyId: envs.aws_access_key,
        secretAccessKey: envs.aws_secret_key,
      },
    });
    this.bucketName = envs.aws_bucket_name;
  }

  private async uploadFile(file: Express.Multer.File) {
    const key = `users/${uuid()}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    return key;
  }

  private async getFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    return url;
  }

  async updateUserFile(file: Express.Multer.File, user: User) {
    const path = await this.uploadFile(file);
    const userUpdated = await this.userService.updateUserFile(
      user.dataValues.id,
      path,
    );
    if (!userUpdated) {
      throw new BadRequestException('User not found');
    }
    userUpdated.dataValues.photo_url = await this.getFile(path);
    return userUpdated;
  }
}
