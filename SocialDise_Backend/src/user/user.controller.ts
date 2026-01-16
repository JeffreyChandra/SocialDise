// src/user/user.controller.ts

import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users') // Endpoint dasar: /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  // API Endpoint: GET /users
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}