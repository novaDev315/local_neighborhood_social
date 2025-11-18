import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../../database/entities/business.entity';
import { BusinessReview } from '../../database/entities/business-review.entity';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    @InjectRepository(BusinessReview)
    private reviewsRepository: Repository<BusinessReview>,
  ) {}

  async findAll() {
    return this.businessesRepository.find({
      order: { rating: 'DESC' },
    });
  }

  // TODO: Implement business registration
  // TODO: Implement verification system
  // TODO: Implement reviews and ratings
  // TODO: Implement special offers
  // TODO: Implement location-based search
}
