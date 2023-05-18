import { Injectable } from '@nestjs/common';
import { Client as MinioClient, UploadedObjectInfo } from 'minio';

@Injectable()
export class MinioService {
  private minioClient = new MinioClient({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'root',
    secretKey: 'seFdoq1gqWDyNW9e',
  });

  uploadFile(filename: string, filepath: string): Promise<UploadedObjectInfo> {
    return this.minioClient.fPutObject('audio', filename, filepath);
  }
}
