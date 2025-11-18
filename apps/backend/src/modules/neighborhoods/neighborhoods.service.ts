import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Neighborhood } from '../../database/entities/neighborhood.entity';

@Injectable()
export class NeighborhoodsService {
  constructor(
    @InjectRepository(Neighborhood)
    private neighborhoodsRepository: Repository<Neighborhood>,
  ) {}

  async findAll() {
    return this.neighborhoodsRepository.find();
  }

  async findOne(id: string) {
    return this.neighborhoodsRepository.findOne({ where: { id } });
  }

  // TODO: Implement neighborhood creation with PostGIS boundary
  // TODO: Implement member management
  // TODO: Implement nearby neighborhoods search
}
