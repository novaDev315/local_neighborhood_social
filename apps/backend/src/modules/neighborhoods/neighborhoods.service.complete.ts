import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Neighborhood } from '../../database/entities/neighborhood.entity';
import { ICreateNeighborhoodDto, IUpdateNeighborhoodDto } from '@neighborhood/shared';

@Injectable()
export class NeighborhoodsService {
  constructor(
    @InjectRepository(Neighborhood)
    private neighborhoodsRepository: Repository<Neighborhood>,
  ) {}

  async findAll() {
    return this.neighborhoodsRepository.find({
      order: { memberCount: 'DESC' },
    });
  }

  async findOne(id: string) {
    const neighborhood = await this.neighborhoodsRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!neighborhood) {
      throw new NotFoundException(`Neighborhood with ID ${id} not found`);
    }

    return neighborhood;
  }

  async create(createNeighborhoodDto: ICreateNeighborhoodDto) {
    const { centerPoint, radius, ...rest } = createNeighborhoodDto;

    // Create circular boundary using PostGIS
    // ST_Buffer creates a circle with the given radius in meters
    const centerPointWKT = `POINT(${centerPoint.longitude} ${centerPoint.latitude})`;

    const neighborhood = this.neighborhoodsRepository.create({
      ...rest,
      centerPoint: centerPointWKT,
      radius,
      settings: {
        requireAddressVerification: true,
        allowPublicPosts: true,
        moderationEnabled: true,
        autoJoinEnabled: false,
      },
    });

    // Use raw query to create boundary with PostGIS
    const saved = await this.neighborhoodsRepository.save(neighborhood);

    // Update boundary to be a circle around center point
    await this.neighborhoodsRepository.query(
      `UPDATE neighborhoods
       SET boundary = ST_Buffer(
         ST_GeographyFromText($1)::geography,
         $2
       )
       WHERE id = $3`,
      [centerPointWKT, radius, saved.id],
    );

    return this.findOne(saved.id);
  }

  async update(id: string, updateNeighborhoodDto: IUpdateNeighborhoodDto) {
    const neighborhood = await this.findOne(id);
    Object.assign(neighborhood, updateNeighborhoodDto);
    return this.neighborhoodsRepository.save(neighborhood);
  }

  async remove(id: string) {
    const neighborhood = await this.findOne(id);
    await this.neighborhoodsRepository.remove(neighborhood);
  }

  // Find neighborhoods near a location (within distance in meters)
  async findNearby(latitude: number, longitude: number, distanceMeters = 10000) {
    const point = `POINT(${longitude} ${latitude})`;

    return this.neighborhoodsRepository
      .createQueryBuilder('neighborhood')
      .where(
        `ST_DWithin(
          neighborhood.centerPoint,
          ST_GeographyFromText(:point),
          :distance
        )`,
        { point, distance: distanceMeters },
      )
      .addSelect(
        `ST_Distance(
          neighborhood.centerPoint,
          ST_GeographyFromText(:point)
        )`,
        'distance',
      )
      .orderBy('distance', 'ASC')
      .getMany();
  }

  // Check if a point is within a neighborhood boundary
  async isPointInNeighborhood(neighborhoodId: string, latitude: number, longitude: number): Promise<boolean> {
    const point = `POINT(${longitude} ${latitude})`;

    const result = await this.neighborhoodsRepository
      .createQueryBuilder('neighborhood')
      .where('neighborhood.id = :id', { id: neighborhoodId })
      .andWhere(
        `ST_Contains(
          neighborhood.boundary,
          ST_GeographyFromText(:point)::geography
        )`,
        { point },
      )
      .getOne();

    return !!result;
  }

  // Find neighborhood for a given address/location
  async findNeighborhoodForLocation(latitude: number, longitude: number) {
    const point = `POINT(${longitude} ${latitude})`;

    return this.neighborhoodsRepository
      .createQueryBuilder('neighborhood')
      .where(
        `ST_Contains(
          neighborhood.boundary,
          ST_GeographyFromText(:point)::geography
        )`,
        { point },
      )
      .getOne();
  }

  // Get neighborhood statistics
  async getStatistics(id: string) {
    const neighborhood = await this.findOne(id);

    // In production, query related entities for actual counts
    return {
      id: neighborhood.id,
      name: neighborhood.name,
      memberCount: neighborhood.memberCount,
      // These would be actual queries in production
      activeMembers: 0,
      postsThisWeek: 0,
      eventsThisMonth: 0,
      businessCount: 0,
      groupCount: 0,
    };
  }

  async incrementMemberCount(id: string) {
    await this.neighborhoodsRepository.increment({ id }, 'memberCount', 1);
  }

  async decrementMemberCount(id: string) {
    await this.neighborhoodsRepository.decrement({ id }, 'memberCount', 1);
  }
}
