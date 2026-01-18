// src/post/dto/create-post.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsUrl, IsNumber, Min, Max } from 'class-validator';

export class CreatePostDto {
  // ... properti lama ...
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  userId: number; 
  
  // FIELD BARU: Trusted Score
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  trustedScore?: number; // Nilai harus antara 0 (sangat tidak dipercaya) dan 1 (sangat dipercaya)
}