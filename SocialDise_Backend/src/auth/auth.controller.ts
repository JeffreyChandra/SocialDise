// src/auth/auth.controller.ts (Diperbaiki)

import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

// --- Asumsi DTO (Anda perlu membuatnya!) ---
// import { RegisterDto } from './dto/register.dto'; 
// import { LoginDto } from './dto/login.dto'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint: POST /auth/register
  @Post('register')
  async register(@Body() body: any) {
    // Di aplikasi nyata, gunakan DTO dengan ValidationPipe untuk validasi ini
    const { email, name, password } = body;
    if (!email || !name || !password) {
      throw new BadRequestException('Email, Nama, dan password harus diisi.');
    }
    
    const user = await this.authService.register(email, name, password);
    
    // Bersihkan password dari respons register
    const { password: userPass, ...result } = user;
    return result;
  }

  @Post('login')
  async login(@Body() body: any) {
    // Di aplikasi nyata, gunakan LoginDto dengan ValidationPipe
    const { email, password } = body;
    
    // 1. Validasi user
    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      // 2. Gunakan exception standar NestJS
      throw new UnauthorizedException('Kredensial tidak valid');
    }
    
    // 3. Panggil service login yang baru
    return this.authService.login(user);
  }
}