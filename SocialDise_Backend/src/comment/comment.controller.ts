// src/comment/comment.controller.ts

import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './create-comment.dto';

@Controller('posts/:postId/comments') // Nested route: /posts/1/comments
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // POST /posts/:postId/comments -> C: Create Comment
  @Post()
  async create(
    @Param('postId', ParseIntPipe) postId: number, 
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.create(postId, createCommentDto);
  }

  // GET /posts/:postId/comments -> R: Read All Comments for a Post
  @Get()
  async findAll(@Param('postId', ParseIntPipe) postId: number): Promise<Comment[]> {
    return this.commentService.findAllByPost(postId);
  }

  // PUT /posts/:postId/comments/:commentId -> U: Update Comment
  @Put(':commentId')
  async update(
    @Param('postId', ParseIntPipe) postId: number, 
    @Param('commentId', ParseIntPipe) commentId: number, 
    @Body() updateData: Partial<CreateCommentDto>,
  ): Promise<Comment> {
    return this.commentService.update(postId, commentId, updateData);
  }

  // DELETE /posts/:postId/comments/:commentId -> D: Delete Comment
  @Delete(':commentId')
  @HttpCode(204)
  async remove(
    @Param('postId', ParseIntPipe) postId: number, 
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<void> {
    return this.commentService.remove(postId, commentId);
  }
}