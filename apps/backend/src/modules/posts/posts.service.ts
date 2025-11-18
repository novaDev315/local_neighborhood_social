import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../database/entities/post.entity';
import { Comment } from '../../database/entities/comment.entity';
import { ICreatePostDto, IUpdatePostDto } from '@neighborhood/shared';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async findAll(neighborhoodId?: string, limit = 50, offset = 0) {
    const query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.neighborhood', 'neighborhood')
      .orderBy('post.isPinned', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (neighborhoodId) {
      query.where('post.neighborhoodId = :neighborhoodId', { neighborhoodId });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'neighborhood'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async create(createPostDto: ICreatePostDto, authorId: string, neighborhoodId: string) {
    const post = this.postsRepository.create({
      ...createPostDto,
      authorId,
      neighborhoodId,
      reactions: { like: 0, love: 0, helpful: 0, thanks: 0, total: 0 },
      commentCount: 0,
    });

    return this.postsRepository.save(post);
  }

  async update(id: string, updatePostDto: IUpdatePostDto, userId: string) {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    Object.assign(post, updatePostDto);
    post.isEdited = true;

    return this.postsRepository.save(post);
  }

  async remove(id: string, userId: string) {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postsRepository.remove(post);
  }

  async addReaction(postId: string, reactionType: 'like' | 'love' | 'helpful' | 'thanks') {
    const post = await this.findOne(postId);

    post.reactions[reactionType]++;
    post.reactions.total++;

    return this.postsRepository.save(post);
  }

  async removeReaction(postId: string, reactionType: 'like' | 'love' | 'helpful' | 'thanks') {
    const post = await this.findOne(postId);

    if (post.reactions[reactionType] > 0) {
      post.reactions[reactionType]--;
      post.reactions.total--;
    }

    return this.postsRepository.save(post);
  }

  // Comment operations
  async findComments(postId: string) {
    return this.commentsRepository.find({
      where: { postId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  async createComment(postId: string, authorId: string, content: string, parentId?: string) {
    const post = await this.findOne(postId);

    const comment = this.commentsRepository.create({
      postId,
      authorId,
      content,
      parentId,
      reactions: { like: 0, love: 0, helpful: 0, thanks: 0, total: 0 },
    });

    await this.commentsRepository.save(comment);

    // Update comment count
    post.commentCount++;
    await this.postsRepository.save(post);

    return comment;
  }

  async updateComment(commentId: string, userId: string, content: string) {
    const comment = await this.commentsRepository.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.content = content;
    return this.commentsRepository.save(comment);
  }

  async removeComment(commentId: string, userId: string) {
    const comment = await this.commentsRepository.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    const post = await this.findOne(comment.postId);
    post.commentCount--;
    await this.postsRepository.save(post);

    await this.commentsRepository.remove(comment);
  }

  async togglePin(postId: string) {
    const post = await this.findOne(postId);
    post.isPinned = !post.isPinned;
    return this.postsRepository.save(post);
  }
}
