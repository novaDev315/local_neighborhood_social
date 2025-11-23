import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ServiceCategory } from '../../database/entities/recommendation.entity';

@ApiTags('recommendations')
@Controller('recommendations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecommendationsController {
  constructor(private readonly service: RecommendationsService) {}

  @ApiOperation({ summary: 'Get all recommendations' })
  @Get()
  findAll(@Query('category') category?: ServiceCategory) {
    return this.service.findAll(category);
  }

  @ApiOperation({ summary: 'Search recommendations' })
  @Get('search')
  search(@Query('q') query: string) {
    return this.service.search(query);
  }

  @ApiOperation({ summary: 'Get single recommendation' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Create recommendation' })
  @Post()
  create(@Body() body: any, @Request() req) {
    return this.service.create(body, req.user.userId);
  }

  @ApiOperation({ summary: 'Update recommendation' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.service.update(id, body, req.user.userId);
  }

  @ApiOperation({ summary: 'Add review to recommendation' })
  @Post(':id/reviews')
  addReview(@Param('id') id: string, @Body() body: { rating: number; comment: string; serviceDate?: Date }, @Request() req) {
    return this.service.addReview(id, req.user.userId, body);
  }

  @ApiOperation({ summary: 'Get reviews for recommendation' })
  @Get(':id/reviews')
  getReviews(@Param('id') id: string) {
    return this.service.getReviews(id);
  }

  @ApiOperation({ summary: 'Mark review as helpful' })
  @Post('reviews/:reviewId/helpful')
  markHelpful(@Param('reviewId') reviewId: string) {
    return this.service.markHelpful(reviewId);
  }

  @ApiOperation({ summary: 'Delete recommendation' })
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.service.delete(id, req.user.userId);
  }
}
