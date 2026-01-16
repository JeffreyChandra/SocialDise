// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Daftarkan entitas
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export jika digunakan oleh modul lain (misalnya AuthModule)
})
export class UserModule {}