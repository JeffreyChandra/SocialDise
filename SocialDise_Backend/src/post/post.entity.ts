// src/post/post.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  mediaUrl: string; 

  @Column({ default: 0 }) 
  likesCount: number;

  @Column({nullable: true}) 
  userId: number; 
  
  // KOLOM BARU: Trusted Score (misalnya 0.00 hingga 1.00)
  @Column({ type: 'numeric', precision: 3, scale: 2, default: 1.00 })
  trustedScore: number; // Nilai default 1.00 (atau 100%) jika belum dicek

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' }) // Tentukan kolom kunci asing di tabel posts
  user: User;

  @OneToMany(() => Comment, comment => comment.post, { 
    cascade: true, 
  })
  comments: Comment[];
}