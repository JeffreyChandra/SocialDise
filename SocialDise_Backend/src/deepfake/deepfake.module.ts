import { Module } from '@nestjs/common';
import { DeepfakeController } from './deepfake.controller';
import { DeepfakeService } from './deepfake.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    CloudinaryModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [DeepfakeController],
  providers: [DeepfakeService],
})
export class DeepfakeModule {}