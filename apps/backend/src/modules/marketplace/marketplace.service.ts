import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceItem } from '../../database/entities/marketplace-item.entity';
import { ICreateMarketplaceItemDto, IUpdateMarketplaceItemDto, MarketplaceCategory } from '@neighborhood/shared';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(MarketplaceItem)
    private marketplaceRepository: Repository<MarketplaceItem>,
  ) {}

  async findAll(neighborhoodId?: string, category?: MarketplaceCategory, limit = 50, offset = 0) {
    const query = this.marketplaceRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.seller', 'seller')
      .leftJoinAndSelect('item.neighborhood', 'neighborhood')
      .where('item.status = :status', { status: 'available' })
      .orderBy('item.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (neighborhoodId) {
      query.andWhere('item.neighborhoodId = :neighborhoodId', { neighborhoodId });
    }

    if (category) {
      query.andWhere('item.category = :category', { category });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const item = await this.marketplaceRepository.findOne({
      where: { id },
      relations: ['seller', 'neighborhood'],
    });

    if (!item) {
      throw new NotFoundException(`Marketplace item with ID ${id} not found`);
    }

    // Increment view count
    await this.marketplaceRepository.increment({ id }, 'views', 1);

    return item;
  }

  async create(createItemDto: ICreateMarketplaceItemDto, sellerId: string, neighborhoodId: string, location: { latitude: number; longitude: number }) {
    const locationWKT = `POINT(${location.longitude} ${location.latitude})`;

    const item = this.marketplaceRepository.create({
      ...createItemDto,
      sellerId,
      neighborhoodId,
      location: locationWKT,
      views: 0,
      savedCount: 0,
    });

    // Set display address (fuzzy for privacy - just neighborhood/city)
    item.displayAddress = 'Location in neighborhood';

    return this.marketplaceRepository.save(item);
  }

  async update(id: string, updateItemDto: IUpdateMarketplaceItemDto, userId: string) {
    const item = await this.findOne(id);

    if (item.sellerId !== userId) {
      throw new ForbiddenException('You can only edit your own listings');
    }

    Object.assign(item, updateItemDto);
    return this.marketplaceRepository.save(item);
  }

  async remove(id: string, userId: string) {
    const item = await this.findOne(id);

    if (item.sellerId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.marketplaceRepository.remove(item);
  }

  async markAsSold(id: string, userId: string) {
    const item = await this.findOne(id);

    if (item.sellerId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    item.status = 'sold';
    return this.marketplaceRepository.save(item);
  }

  async search(query: string, neighborhoodId?: string) {
    const qb = this.marketplaceRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.seller', 'seller')
      .where('item.status = :status', { status: 'available' })
      .andWhere(
        '(item.title ILIKE :query OR item.description ILIKE :query)',
        { query: `%${query}%` },
      );

    if (neighborhoodId) {
      qb.andWhere('item.neighborhoodId = :neighborhoodId', { neighborhoodId });
    }

    return qb.getMany();
  }

  async findNearby(latitude: number, longitude: number, radiusMeters = 5000) {
    const point = `POINT(${longitude} ${latitude})`;

    return this.marketplaceRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.seller', 'seller')
      .where('item.status = :status', { status: 'available' })
      .andWhere(
        `ST_DWithin(
          item.location,
          ST_GeographyFromText(:point),
          :radius
        )`,
        { point, radius: radiusMeters },
      )
      .addSelect(
        `ST_Distance(
          item.location,
          ST_GeographyFromText(:point)
        )`,
        'distance',
      )
      .orderBy('distance', 'ASC')
      .getMany();
  }

  async getFreeItems(neighborhoodId?: string) {
    const query = this.marketplaceRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.seller', 'seller')
      .where('item.isFree = true')
      .andWhere('item.status = :status', { status: 'available' })
      .orderBy('item.createdAt', 'DESC');

    if (neighborhoodId) {
      query.andWhere('item.neighborhoodId = :neighborhoodId', { neighborhoodId });
    }

    return query.getMany();
  }

  async getSellerItems(sellerId: string) {
    return this.marketplaceRepository.find({
      where: { sellerId },
      relations: ['neighborhood'],
      order: { createdAt: 'DESC' },
    });
  }

  async toggleSave(itemId: string) {
    // In production, this would track user-specific saves
    await this.marketplaceRepository.increment({ id: itemId }, 'savedCount', 1);
  }
}
