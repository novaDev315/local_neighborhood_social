import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICreatePostDto, IUpdatePostDto } from '@neighborhood/shared';

@ApiTags('posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Get all posts' })
  @Get()
  findAll(
    @Query('neighborhoodId') neighborhoodId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.postsService.findAll(neighborhoodId, limit, offset);
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create new post' })
  @Post()
  create(@Body() createPostDto: ICreatePostDto, @Request() req) {
    return this.postsService.create(
      createPostDto,
      req.user.userId,
      req.user.neighborhoodId,
    );
  }

  @ApiOperation({ summary: 'Update post' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: IUpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(id, updatePostDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete post' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Add reaction to post' })
  @Post(':id/reactions/:type')
  addReaction(
    @Param('id') id: string,
    @Param('type') type: 'like' | 'love' | 'helpful' | 'thanks',
  ) {
    return this.postsService.addReaction(id, type);
  }

  @ApiOperation({ summary: 'Remove reaction from post' })
  @Delete(':id/reactions/:type')
  removeReaction(
    @Param('id') id: string,
    @Param('type') type: 'like' | 'love' | 'helpful' | 'thanks',
  ) {
    return this.postsService.removeReaction(id, type);
  }

  @ApiOperation({ summary: 'Toggle pin status' })
  @Patch(':id/pin')
  togglePin(@Param('id') id: string) {
    return this.postsService.togglePin(id);
  }

  @ApiOperation({ summary: 'Get comments for post' })
  @Get(':id/comments')
  findComments(@Param('id') id: string) {
    return this.postsService.findComments(id);
  }

  @ApiOperation({ summary: 'Create comment on post' })
  @Post(':id/comments')
  createComment(
    @Param('id') postId: string,
    @Body() body: { content: string; parentId?: string },
    @Request() req,
  ) {
    return this.postsService.createComment(
      postId,
      req.user.userId,
      body.content,
      body.parentId,
    );
  }

  @ApiOperation({ summary: 'Update comment' })
  @Patch('comments/:commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body() body: { content: string },
    @Request() req,
  ) {
    return this.postsService.updateComment(commentId, req.user.userId, body.content);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @Delete('comments/:commentId')
  removeComment(@Param('commentId') commentId: string, @Request() req) {
    return this.postsService.removeComment(commentId, req.user.userId);
  }
}
