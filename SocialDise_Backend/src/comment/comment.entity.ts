// src/comment/comment.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from '../post/post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string; // Contoh: nama user yang berkomentar

  @Column()
  content: string;

  // Relasi: Banyak Comment dimiliki oleh Satu Post
  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  // Kolom ID Postingan yang direlasikan
  @Column()
  postId: number; 
}