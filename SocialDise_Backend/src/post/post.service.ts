// src/post/post.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  // **C - Create**
  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const newPost = this.postsRepository.create({
        ...createPostDto,
        userId: userId, 
    });
    return this.postsRepository.save(newPost);
  }

  // **R - Read All (Semua Post)**
  findAll(): Promise<Post[]> {
    return this.postsRepository.find({ 
        relations: ['user', 'comments'],
        order: { id: 'DESC' },
    }); 
  }

  // **R - Read All By User (Khusus)**
  async findAllByUserId(userId: number): Promise<Post[]> {
    return this.postsRepository.find({
      where: { userId: userId },
      relations: ['user', 'comments'],
      order: { id: 'DESC' },
    });
  }

  // **R - Read One**
  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ 
        where: { id },
        relations: ['user', 'comments'], 
    });
    
    if (!post) {
      throw new NotFoundException(`Postingan dengan ID ${id} tidak ditemukan.`);
    }
    
    // Hapus password user sebelum dikembalikan
    if (post.user && 'password' in post.user) {
        delete (post.user as any).password;
    }
    
    return post;
  }

  // **U - Update**
  async update(id: number, updateData: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, updateData); 
    return this.postsRepository.save(post);
  }

  // **D - Delete**
  async remove(id: number): Promise<void> {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Postingan ID ${id} tidak ditemukan.`);
    }
  }
  
  // FITUR LIKE
  async addLike(id: number): Promise<Post> {
    await this.postsRepository.increment({ id }, 'likesCount', 1);
    return this.findOne(id);
  }
}