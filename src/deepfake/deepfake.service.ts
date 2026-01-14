import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

export interface DetectionResult {
  score: number;
  message: string;
}

@Injectable()
export class DeepfakeService {
  private readonly DEEPFAKE_THRESHOLD = 0.4;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async detectAndProcessMedia(file: Express.Multer.File) {
    let detectionResult: DetectionResult;

    if (file.mimetype.startsWith('image/')) {
      detectionResult = await this.checkImage(file);
    } else if (file.mimetype.startsWith('video/')) {
      detectionResult = await this.checkVideo(file);
    } else {
      throw new BadRequestException(
        'Tipe file tidak didukung. Harap upload image atau video.',
      );
    }

    const isSafe = detectionResult.score <= this.DEEPFAKE_THRESHOLD;

    let fileInfo: {
      url: string;
      format: string;
      resource_type: string;
    } | null = null;
    let responseMessage = '';

    // Always attempt to upload, regardless of safety score
    try {
      const uploadResult = await this.cloudinaryService.uploadMedia(file);

      fileInfo = {
        url: uploadResult.secure_url,
        format: uploadResult.format,
        resource_type: uploadResult.resource_type,
      };

      if (isSafe) {
        responseMessage =
          'Upload berhasil. Media terverifikasi aman dan telah disimpan.';
      } else {
        responseMessage = `Upload berhasil, namun terdeteksi deepfake (${detectionResult.message}).`;
      }
    } catch (error) {
      console.error('Gagal upload ke Cloudinary:', error);
      throw new InternalServerErrorException(
        'Gagal menyimpan file ke Cloudinary.',
      );
    }

    return {
      isSafe: isSafe,
      message: responseMessage,
      detection: detectionResult,
      fileInfo: fileInfo,
    };
  }

  private async checkImage(
    file: Express.Multer.File,
  ): Promise<DetectionResult> {
    const apiUrl = 'https://api.sightengine.com/1.0/check.json';
    const form = this.createSightengineForm(file);

    try {
      const resp = await firstValueFrom(
        this.httpService.post(apiUrl, form, {
          headers: form.getHeaders(),
        }),
      );

      const score = resp.data?.type?.deepfake ?? 0;

      return {
        score: score,
        message: `Image terdeteksi ${score * 100}% deepfake.`,
      };
    } catch (error) {
      this.handleSightengineError(error);
    }
  }

  private async checkVideo(
    file: Express.Multer.File,
  ): Promise<DetectionResult> {
    const apiUrl = 'https://api.sightengine.com/1.0/video/check-sync.json';
    const form = this.createSightengineForm(file);

    try {
      const resp = await firstValueFrom(
        this.httpService.post(apiUrl, form, {
          headers: form.getHeaders(),
        }),
      );

      const frames = resp.data?.data?.frames;
      if (!frames || frames.length === 0) {
        throw new InternalServerErrorException(
          'API tidak mengembalikan hasil frame.',
        );
      }

      const frameScores = frames.map((frame: any) => frame.type.deepfake);
      const maxScore = Math.max(...frameScores);

      return {
        score: maxScore,
        message: `Video terdeteksi ${maxScore * 100}% deepfake (skor tertinggi dari ${frames.length} frame).`,
      };
    } catch (error) {
      this.handleSightengineError(error);
    }
  }

  private createSightengineForm(file: Express.Multer.File): FormData {
    const form = new FormData();
    form.append('media', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    form.append('models', 'deepfake');
    form.append('api_user', this.configService.get('SIGHTENGINE_API_USER'));
    form.append('api_secret', this.configService.get('SIGHTENGINE_API_SECRET'));
    return form;
  }

  private handleSightengineError(error: any): never {
    const status = error.response?.status;
    const errText = error.response?.data?.error?.message || error.message;
    console.error('[Sightengine Call Failed]', status, errText);

    if (status === 400) {
      throw new BadRequestException(`Sightengine Error: ${errText}`);
    }
    throw new InternalServerErrorException(
      'Tidak dapat menghubungi layanan deteksi deepfake.',
    );
  }
}
