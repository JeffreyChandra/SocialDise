// src/auth/auth.service.ts (Final)

import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // --- REGISTRASI (Tidak Berubah) ---
  async register(email: string, name: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar.');
    }
    const newUser = this.usersRepository.create({ email, name, password });
    return this.usersRepository.save(newUser);
  }

  // --- LOGIN: Validasi Kredensial (Diperbaiki) ---
  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ 
        where: { email },
        // Baris ini sekarang valid
        select: ['id', 'email', 'name', 'password', 'followers', 'following'] 
    });
    
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user; // Mengembalikan objek user lengkap
    }
    return null;
  }

  // --- LOGIN: Membuat JWT dan Mengembalikan Data User (Diperbaiki) ---
  async login(user: User): Promise<{ user: Partial<User>; accessToken: string }> {
    
    const payload = { email: user.email, sub: user.id, id: user.id };
    const accessToken = this.jwtService.sign(payload);
    
    // Bersihkan password dari objek user.
    // Properti followers dan following akan otomatis disertakan dalam 'result'.
    const { password, ...result } = user;
    
    return {
      user: result,
      accessToken: accessToken,
    };
  }
}