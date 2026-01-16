// src/comment/dto/create-comment.dto.ts

import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  author: string; // Nama penulis komentar

  @IsString()
  @IsNotEmpty()
  content: string; // Isi komentar
  
  // Catatan: postId tidak perlu dimasukkan di sini karena diambil dari URL
}