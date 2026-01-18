import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeepfakeService } from './deepfake.service';

@Controller('deepfake')
export class DeepfakeController {
  constructor(private readonly deepfakeService: DeepfakeService) {}

  @Post('detect')
  @UseInterceptors(FileInterceptor('media'))
  async detectMedia(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 50 }),
        ],
        exceptionFactory: (error) => {
          return new BadRequestException(`Validasi file gagal: ${error}`);
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File media tidak ditemukan.');
    }
    return this.deepfakeService.detectAndProcessMedia(file);
  }
}
