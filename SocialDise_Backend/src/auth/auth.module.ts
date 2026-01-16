// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'; // <-- Tambahkan
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/user.entity';
import { JwtStrategy } from './auth.jwt.strategy'; // <-- Pastikan path ini benar

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule, // <-- Daftarkan Passport Module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-default-secret',
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // <-- Daftarkan Strategy agar Passport bisa menggunakannya
  ],
  exports: [
    AuthService, 
    JwtModule,    // <-- Export untuk digunakan di Guard
    PassportModule, // <-- Export untuk digunakan di Guard
  ],
})
export class AuthModule {}