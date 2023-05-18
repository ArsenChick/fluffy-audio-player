import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { unlink } from 'fs/promises';
import { v4 as uuid } from 'uuid';
import { extname, parse } from 'path';

import { MinioService } from '../services/minio.service';
import { AnalyzeService } from '../services/analyze.service';
import { DatabaseService } from '../services/database.service';
import { AudioStub } from '../interfaces/audio.interface';

@Controller()
export class UploadController {
  constructor(
    private readonly minioService: MinioService,
    private readonly analyzeService: AnalyzeService,
    private readonly databaseService: DatabaseService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${process.cwd()}/tmp`,
      filename: (_req, file, callback) => {
        callback(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { filename, originalname, path } = file;
    const promise = this.minioService.uploadFile(filename, path)
      .then(() => {
        unlink(path);
        const audioStub: AudioStub = {
          title: parse(originalname).name,
          filename: filename
        };
        this.databaseService.createStub(audioStub);
        return this.analyzeService.analyzeFile(filename);
      })
      .then((analysis) =>
        this.databaseService.updateAnalysis(filename, analysis));
    return promise;
  }
}
