import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadController } from './controllers/upload.controller';
import { AnalyzeService } from './services/analyze.service';
import { MinioService } from './services/minio.service';
import { DatabaseService } from './services/database.service';
import { DatabaseController } from './controllers/database.controller';
import { AudioEntity } from './entities/audio.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'fluffy',
      entities: [AudioEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AudioEntity]),
  ],
  controllers: [UploadController, DatabaseController],
  providers: [AnalyzeService, MinioService, DatabaseService],
})
export class AppModule {}
