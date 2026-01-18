// src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Mengambil semua user dari database.
   * @returns Promise<User[]> Daftar semua user.
   */
  async findAll(): Promise<User[]> {
    // find() tanpa argumen akan mengambil semua baris dari tabel 'users'
    return this.usersRepository.find({ 
        select: ['id', 'name', 'email', ] // Pilih kolom yang aman untuk ditampilkan
    });
  }
}