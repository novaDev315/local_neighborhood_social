import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../../database/entities/business.entity';
import { BusinessReview } from '../../database/entities/business-review.entity';
import { ICreateBusinessDto, IUpdateBusinessDto } from '@neighborhood/shared';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    @InjectRepository(BusinessReview)
    private reviewsRepository: Repository<BusinessReview>,
  ) {}

  async findAll(category?: string, neighborhoodId?: string) {
    const query = this.businessesRepository
      .createQueryBuilder('business')
      .leftJoinAndSelect('business.owner', 'owner')
      .orderBy('business.rating', 'DESC')
      .addOrderBy('business.reviewCount', 'DESC');

    if (category) {
      query.where('business.category = :category', { category });
    }

    if (neighborhoodId) {
      query.andWhere(':neighborhoodId = ANY(business.neighborhoodIds)', { neighborhoodId });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const business = await this.businessesRepository.findOne({
      where: { id },
      relations: ['owner', 'reviews', 'reviews.user'],
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    return business;
  }

  async create(createBusinessDto: ICreateBusinessDto, ownerId: string) {
    const locationWKT = `POINT(${createBusinessDto.location.longitude} ${createBusinessDto.location.latitude})`;

    const business = this.businessesRepository.create({
      ...createBusinessDto,
      ownerId,
      location: locationWKT,
      locationData: createBusinessDto.location,
      verified: false,
      rating: 0,
      reviewCount: 0,
      neighborhoodIds: [], // Will be populated based on location
      claimedAt: new Date(),
    });

    return this.businessesRepository.save(business);
  }

  async update(id: string, updateBusinessDto: IUpdateBusinessDto, userId: string) {
    const business = await this.findOne(id);

    if (business.ownerId !== userId) {
      throw new ForbiddenException('You can only edit your own business');
    }

    Object.assign(business, updateBusinessDto);
    return this.businessesRepository.save(business);
  }

  async remove(id: string, userId: string) {
    const business = await this.findOne(id);

    if (business.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own business');
    }

    await this.businessesRepository.remove(business);
  }

  async verify(id: string) {
    const business = await this.findOne(id);
    business.verified = true;
    return this.businessesRepository.save(business);
  }

  // Reviews
  async createReview(businessId: string, userId: string, rating: number, title: string, content: string, images?: string[]) {
    const business = await this.findOne(businessId);

    // Check if user already reviewed
    const existing = await this.reviewsRepository.findOne({
      where: { businessId, userId },
    });

    if (existing) {
      throw new ForbiddenException('You have already reviewed this business');
    }

    const review = this.reviewsRepository.create({
      businessId,
      userId,
      rating,
      title,
      content,
      images,
      helpful: 0,
      verifiedPurchase: false,
    });

    await this.reviewsRepository.save(review);

    // Update business rating
    await this.updateBusinessRating(businessId);

    return review;
  }

  async updateReview(reviewId: string, userId: string, rating?: number, title?: string, content?: string) {
    const review = await this.reviewsRepository.findOne({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (content !== undefined) review.content = content;

    await this.reviewsRepository.save(review);

    // Update business rating
    await this.updateBusinessRating(review.businessId);

    return review;
  }

  async deleteReview(reviewId: string, userId: string) {
    const review = await this.reviewsRepository.findOne({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const businessId = review.businessId;
    await this.reviewsRepository.remove(review);

    // Update business rating
    await this.updateBusinessRating(businessId);
  }

  async getReviews(businessId: string) {
    return this.reviewsRepository.find({
      where: { businessId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  private async updateBusinessRating(businessId: string) {
    const reviews = await this.reviewsRepository.find({ where: { businessId } });

    if (reviews.length === 0) {
      await this.businessesRepository.update(businessId, { rating: 0, reviewCount: 0 });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    await this.businessesRepository.update(businessId, {
      rating: Math.round(avgRating * 100) / 100,
      reviewCount: reviews.length,
    });
  }

  async search(query: string) {
    return this.businessesRepository
      .createQueryBuilder('business')
      .where('business.name ILIKE :query', { query: `%${query}%` })
      .orWhere('business.description ILIKE :query', { query: `%${query}%` })
      .orderBy('business.rating', 'DESC')
      .getMany();
  }

  async findNearby(latitude: number, longitude: number, radiusMeters = 5000) {
    const point = `POINT(${longitude} ${latitude})`;

    return this.businessesRepository
      .createQueryBuilder('business')
      .where(
        `ST_DWithin(
          business.location,
          ST_GeographyFromText(:point),
          :radius
        )`,
        { point, radius: radiusMeters },
      )
      .addSelect(
        `ST_Distance(
          business.location,
          ST_GeographyFromText(:point)
        )`,
        'distance',
      )
      .orderBy('distance', 'ASC')
      .getMany();
  }
}
