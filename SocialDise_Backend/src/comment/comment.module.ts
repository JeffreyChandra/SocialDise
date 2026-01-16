// src/comment/comment.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Post } from '../post/post.entity'; // Diperlukan untuk injeksi Post Repository

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post]), // Daftarkan kedua entitas
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}