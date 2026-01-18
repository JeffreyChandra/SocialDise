import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Asumsi: payload token Anda terlihat seperti ini
interface JwtPayload {
  id: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // Ambil kunci, dan jika undefined, paksa menggunakan kunci default yang kuat
    const secret = configService.get<string>('JWT_SECRET') || 'FALLBACK_SECRET_KEY_YANG_SANGAT_PANJANG_DAN_ACAK';
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      secretOrKey: secret, // <-- Gunakan variabel 'secret' yang sudah dijamin
      ignoreExpiration: false,
    });
  }

  // Metode validate() akan dieksekusi setelah token diverifikasi
  async validate(payload: JwtPayload) {
    // Apapun yang Anda kembalikan dari sini akan menjadi objek req.user
    // Kita asumsikan payload sudah cukup (mengandung ID dan username)
    return { id: payload.id, username: payload.username }; 
    
    // Jika perlu, Anda bisa mencari user di DB di sini:
    // const user = await this.userService.findOne(payload.id);
    // return user; 
  }
}