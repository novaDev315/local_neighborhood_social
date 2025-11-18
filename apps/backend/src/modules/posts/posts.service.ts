import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../database/entities/post.entity';
import { Comment } from '../../database/entities/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async findAll(neighborhoodId?: string) {
    const query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC');

    if (neighborhoodId) {
      query.where('post.neighborhoodId = :neighborhoodId', { neighborhoodId });
    }

    return query.getMany();
  }

  // TODO: Implement post creation with media upload
  // TODO: Implement reactions system
  // TODO: Implement comments with threading
  // TODO: Implement content moderation
}
