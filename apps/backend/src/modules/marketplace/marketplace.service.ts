import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceItem } from '../../database/entities/marketplace-item.entity';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(MarketplaceItem)
    private marketplaceRepository: Repository<MarketplaceItem>,
  ) {}

  async findAll() {
    return this.marketplaceRepository.find({
      relations: ['seller'],
      where: { status: 'available' },
      order: { createdAt: 'DESC' },
    });
  }

  // TODO: Implement listing creation with image upload
  // TODO: Implement search and filters
  // TODO: Implement messaging between buyers/sellers
  // TODO: Implement ratings and reviews
}
