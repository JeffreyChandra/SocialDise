import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './create-comment.dto';
import { Post } from '../post/post.entity';

export interface TextModerationResult {
  isSafe: boolean;
  flaggedCategories: string[];
  message: string;
}

@Injectable()
export class CommentService {
  private readonly threatKeywords = [
    'kill you',
    'deserve to die',
    'deserve to live',
    'kill yourself',
    'hope you die',
    'should die',
    'gonna kill',
    'want to kill',
    'murder you',
    'end your life',
    'bunuh kamu',
    'bunuh diri',
    'mati saja',
    'mati aja',
    'pantas mati',
    'layak mati',
    'tidak pantas hidup',
    'gak pantas hidup',
    'semoga mati',
    'harusnya mati',
    'mampus',
    'bangsat',
    'anjing',
    'babi',
    'kontol',
    'memek',
    'tai',
    'goblok',
    'tolol',
    'idiot',
    'bodoh',
  ];

  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async checkComment(text: string): Promise<TextModerationResult> {
    const apiUrl = 'https://api.sightengine.com/1.0/text/check.json';

    try {
      const resp = await firstValueFrom(
        this.httpService.post(
          apiUrl,
          new URLSearchParams({
            text: text,
            mode: 'rules',
            lang: 'en',
            api_user: this.configService.get('SIGHTENGINE_API_USER') || '',
            api_secret: this.configService.get('SIGHTENGINE_API_SECRET') || '',
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        ),
      );

      const data = resp.data;
      const flaggedCategories: string[] = [];

      const lowerText = text.toLowerCase();
      const hasThreat = this.threatKeywords.some((keyword) =>
        lowerText.includes(keyword),
      );
      if (hasThreat) {
        flaggedCategories.push('threat');
      }

      if (data.profanity?.matches?.length > 0) {
        flaggedCategories.push('profanity');
      }

      if (data.personal?.matches?.length > 0) {
        flaggedCategories.push('personal_attack');
      }

      if (data.link?.matches?.length > 0) {
        flaggedCategories.push('spam_link');
      }

      if (data['self-harm']?.matches?.length > 0) {
        flaggedCategories.push('self_harm');
      }

      if (data.extremism?.matches?.length > 0) {
        flaggedCategories.push('extremism');
      }

      if (data.sexual?.matches?.length > 0) {
        flaggedCategories.push('sexual');
      }

      if (data.discriminatory?.matches?.length > 0) {
        flaggedCategories.push('discriminatory');
      }

      if (data.insulting?.matches?.length > 0) {
        flaggedCategories.push('insulting');
      }

      const isSafe = flaggedCategories.length === 0;

      return {
        isSafe,
        flaggedCategories,
        message: isSafe
          ? 'Text is clean.'
          : `Flagged for: ${flaggedCategories.join(', ')}.`,
      };
    } catch {
      return {
        isSafe: true,
        flaggedCategories: [],
        message: 'Moderation skipped due to API error.',
      };
    }
  }

  async create(
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(
        `Postingan dengan ID ${postId} tidak ditemukan.`,
      );
    }

    const moderationResult = await this.checkComment(createCommentDto.content);
    if (!moderationResult.isSafe) {
      throw new BadRequestException(
        `Komentar ditolak: ${moderationResult.message}`,
      );
    }

    const newComment = this.commentRepository.create({
      ...createCommentDto,
      post: post,
      postId: postId,
    });

    return this.commentRepository.save(newComment) as Promise<Comment>;
  }

  async findAllByPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { postId: postId },
      order: { id: 'ASC' },
    });
  }

  async update(
    postId: number,
    commentId: number,
    updateData: Partial<CreateCommentDto>,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, postId: postId },
    });

    if (!comment) {
      throw new NotFoundException(
        `Komentar dengan ID ${commentId} pada Post ${postId} tidak ditemukan.`,
      );
    }

    if (updateData.content) {
      const moderationResult = await this.checkComment(updateData.content);
      if (!moderationResult.isSafe) {
        throw new BadRequestException(
          `Komentar ditolak: ${moderationResult.message}`,
        );
      }
    }

    Object.assign(comment, updateData);
    return this.commentRepository.save(comment);
  }

  async remove(postId: number, commentId: number): Promise<void> {
    const result = await this.commentRepository.delete({
      id: commentId,
      postId: postId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Komentar dengan ID ${commentId} pada Post ${postId} tidak ditemukan.`,
      );
    }
  }
}
