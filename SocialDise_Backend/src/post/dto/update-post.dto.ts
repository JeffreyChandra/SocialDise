// src/post/dto/update-post.dto.ts

import { IsString, IsOptional } from 'class-validator';

// PartialType memungkinkan semua properti di CreatePostDto menjadi opsional
// Jika Anda belum menginstal @nestjs/mapped-types, gunakan Partial<CreatePostDto>
// npm install @nestjs/mapped-types
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}