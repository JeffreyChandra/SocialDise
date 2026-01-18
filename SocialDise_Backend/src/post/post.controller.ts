// src/post/post.controller.ts

import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, ParseIntPipe, Req, UseGuards, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express'; 

// Import AuthGuard Anda
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

// Asumsi Payload JWT dan Request
interface JwtPayload {
  sub: number;
  id: number; // Pastikan 'id' ada di payload Anda
  username?: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // ------------------------------------
  // C: CREATE (Membutuhkan Otorisasi)
  // ------------------------------------
  @UseGuards(JwtAuthGuard) 
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: AuthenticatedRequest, 
  ): Promise<PostEntity> {
    // Mengambil ID dari token yang terverifikasi
    const userId = req.user.id; 
    return this.postService.create(createPostDto, userId);
  }
  
  // ------------------------------------
  // R: READ (Semua Post)
  // ------------------------------------
  @Get()
  async findAll(): Promise<PostEntity[]> {
    // Mengembalikan semua postingan publik
    return this.postService.findAll();
  }

  // ------------------------------------
  // R: READ (Berdasarkan Post ID)
  // ------------------------------------
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postService.findOne(id);
  }
  
  // ------------------------------------
  // R: READ (Berdasarkan User ID - Query Parameter)
  // ------------------------------------
  // Endpoint: POST /posts/by-user
  @Post('by-user')
  async findPostsByUserId(@Body('userId', ParseIntPipe) userId: number): Promise<PostEntity[]> {

  
    return this.postService.findAllByUserId(userId);
  }
  
  // ------------------------------------
  // U & D (UPDATE & DELETE)
  // ------------------------------------
  // Anda mungkin ingin menambahkan @UseGuards dan validasi kepemilikan di sini!
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateData: UpdatePostDto
  ): Promise<PostEntity> {
    return this.postService.update(id, updateData);
  }
  
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.postService.remove(id);
  }
  
  // ------------------------------------
  // LIKE
  // ------------------------------------
  @Post(':id/like')
  async likePost(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postService.addLike(id);
  }
}