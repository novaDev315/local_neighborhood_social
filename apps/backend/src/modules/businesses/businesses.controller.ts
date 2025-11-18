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
import { BusinessesService } from './businesses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICreateBusinessDto, IUpdateBusinessDto } from '@neighborhood/shared';

@ApiTags('businesses')
@Controller('businesses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @ApiOperation({ summary: 'Get all businesses' })
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('neighborhoodId') neighborhoodId?: string,
  ) {
    return this.businessesService.findAll(category, neighborhoodId);
  }

  @ApiOperation({ summary: 'Search businesses' })
  @Get('search')
  search(@Query('q') query: string) {
    return this.businessesService.search(query);
  }

  @ApiOperation({ summary: 'Find nearby businesses' })
  @Get('nearby')
  findNearby(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('radius') radius?: number,
  ) {
    return this.businessesService.findNearby(latitude, longitude, radius);
  }

  @ApiOperation({ summary: 'Get business by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @ApiOperation({ summary: 'Get business reviews' })
  @Get(':id/reviews')
  getReviews(@Param('id') businessId: string) {
    return this.businessesService.getReviews(businessId);
  }

  @ApiOperation({ summary: 'Create business' })
  @Post()
  create(@Body() createBusinessDto: ICreateBusinessDto, @Request() req) {
    return this.businessesService.create(createBusinessDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Update business' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: IUpdateBusinessDto,
    @Request() req,
  ) {
    return this.businessesService.update(id, updateBusinessDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete business' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.businessesService.remove(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Verify business (admin only)' })
  @Patch(':id/verify')
  verify(@Param('id') id: string) {
    return this.businessesService.verify(id);
  }

  @ApiOperation({ summary: 'Create review' })
  @Post(':id/reviews')
  createReview(
    @Param('id') businessId: string,
    @Body() body: { rating: number; title: string; content: string; images?: string[] },
    @Request() req,
  ) {
    return this.businessesService.createReview(
      businessId,
      req.user.userId,
      body.rating,
      body.title,
      body.content,
      body.images,
    );
  }

  @ApiOperation({ summary: 'Update review' })
  @Patch('reviews/:reviewId')
  updateReview(
    @Param('reviewId') reviewId: string,
    @Body() body: { rating?: number; title?: string; content?: string },
    @Request() req,
  ) {
    return this.businessesService.updateReview(
      reviewId,
      req.user.userId,
      body.rating,
      body.title,
      body.content,
    );
  }

  @ApiOperation({ summary: 'Delete review' })
  @Delete('reviews/:reviewId')
  deleteReview(@Param('reviewId') reviewId: string, @Request() req) {
    return this.businessesService.deleteReview(reviewId, req.user.userId);
  }
}
