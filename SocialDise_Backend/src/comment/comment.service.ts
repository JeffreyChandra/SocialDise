// src/comment/comment.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './create-comment.dto';
import { Post } from '../post/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post) // Inject Post Repository untuk validasi
    private postRepository: Repository<Post>,
  ) {}

  // **C - Create**
  async create(postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Postingan dengan ID ${postId} tidak ditemukan.`);
    }

    const newComment = this.commentRepository.create({
      ...createCommentDto,
      post: post,
      postId: postId,
    });

    return this.commentRepository.save(newComment) as Promise<Comment>;
  }

  // **R - Read All (by Post)**
  async findAllByPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({ 
      where: { postId: postId },
      order: { id: 'ASC' } 
    });
  }

  // **U - Update**
  async update(postId: number, commentId: number, updateData: Partial<CreateCommentDto>): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ 
      where: { id: commentId, postId: postId } 
    });

    if (!comment) {
      throw new NotFoundException(`Komentar dengan ID ${commentId} pada Post ${postId} tidak ditemukan.`);
    }

    Object.assign(comment, updateData);
    return this.commentRepository.save(comment);
  }

  // **D - Delete**
  async remove(postId: number, commentId: number): Promise<void> {
    const result = await this.commentRepository.delete({ 
      id: commentId, 
      postId: postId 
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Komentar dengan ID ${commentId} pada Post ${postId} tidak ditemukan.`);
    }
  }
}