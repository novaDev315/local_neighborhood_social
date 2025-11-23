import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRecommendation, ServiceReview, ServiceCategory } from '../../database/entities/recommendation.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(ServiceRecommendation) private recRepo: Repository<ServiceRecommendation>,
    @InjectRepository(ServiceReview) private reviewRepo: Repository<ServiceReview>,
  ) {}

  async findAll(category?: ServiceCategory) {
    const query = this.recRepo.createQueryBuilder('rec')
      .leftJoinAndSelect('rec.recommender', 'recommender')
      .where('rec.isActive = :isActive', { isActive: true })
      .orderBy('rec.averageRating', 'DESC');

    if (category) {
      query.andWhere('rec.category = :category', { category });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    return this.recRepo.findOne({
      where: { id },
      relations: ['recommender'],
    });
  }

  async create(data: Partial<ServiceRecommendation>, recommenderId: string) {
    const rec = this.recRepo.create({ ...data, recommenderId });
    return this.recRepo.save(rec);
  }

  async update(id: string, data: Partial<ServiceRecommendation>, userId: string) {
    const rec = await this.recRepo.findOne({ where: { id, recommenderId: userId } });
    if (!rec) return null;
    Object.assign(rec, data);
    return this.recRepo.save(rec);
  }

  async addReview(recommendationId: string, reviewerId: string, data: { rating: number; comment: string; serviceDate?: Date }) {
    const review = this.reviewRepo.create({ recommendationId, reviewerId, ...data });
    await this.reviewRepo.save(review);

    // Update average rating
    const stats = await this.reviewRepo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('review.recommendationId = :recommendationId', { recommendationId })
      .getRawOne();

    await this.recRepo.update(recommendationId, {
      averageRating: parseFloat(stats.avg) || 0,
      totalReviews: parseInt(stats.count) || 0,
    });

    return review;
  }

  async getReviews(recommendationId: string) {
    return this.reviewRepo.find({
      where: { recommendationId },
      relations: ['reviewer'],
      order: { createdAt: 'DESC' },
    });
  }

  async markHelpful(reviewId: string) {
    await this.reviewRepo.increment({ id: reviewId }, 'helpfulCount', 1);
  }

  async search(query: string) {
    return this.recRepo.createQueryBuilder('rec')
      .leftJoinAndSelect('rec.recommender', 'recommender')
      .where('rec.isActive = :isActive', { isActive: true })
      .andWhere('(rec.providerName ILIKE :query OR rec.description ILIKE :query)', { query: `%${query}%` })
      .orderBy('rec.averageRating', 'DESC')
      .getMany();
  }

  async delete(id: string, userId: string) {
    await this.recRepo.update({ id, recommenderId: userId }, { isActive: false });
  }
}
