import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostFound, LostFoundSighting, LostFoundType, LostFoundStatus } from '../../database/entities/lost-found.entity';

@Injectable()
export class LostFoundService {
  constructor(
    @InjectRepository(LostFound) private lostFoundRepo: Repository<LostFound>,
    @InjectRepository(LostFoundSighting) private sightingRepo: Repository<LostFoundSighting>,
  ) {}

  async findAll(type?: LostFoundType) {
    const query = this.lostFoundRepo.createQueryBuilder('lf')
      .leftJoinAndSelect('lf.reporter', 'reporter')
      .where('lf.status = :status', { status: LostFoundStatus.ACTIVE })
      .orderBy('lf.createdAt', 'DESC');

    if (type) {
      query.andWhere('lf.type = :type', { type });
    }

    return query.getMany();
  }

  async findLostPets() {
    return this.findAll(LostFoundType.LOST_PET);
  }

  async findFoundPets() {
    return this.findAll(LostFoundType.FOUND_PET);
  }

  async findOne(id: string) {
    return this.lostFoundRepo.findOne({
      where: { id },
      relations: ['reporter', 'neighborhood'],
    });
  }

  async create(data: Partial<LostFound>, reporterId: string) {
    const lostFound = this.lostFoundRepo.create({
      ...data,
      reporterId,
    });
    return this.lostFoundRepo.save(lostFound);
  }

  async update(id: string, data: Partial<LostFound>, userId: string) {
    const lostFound = await this.lostFoundRepo.findOne({ where: { id, reporterId: userId } });
    if (!lostFound) return null;
    Object.assign(lostFound, data);
    return this.lostFoundRepo.save(lostFound);
  }

  async markAsReunited(id: string, userId: string) {
    return this.update(id, { status: LostFoundStatus.REUNITED }, userId);
  }

  async close(id: string, userId: string) {
    return this.update(id, { status: LostFoundStatus.CLOSED }, userId);
  }

  async addSighting(lostFoundId: string, reporterId: string, data: { location: string; description: string; sightedAt: Date }) {
    const sighting = this.sightingRepo.create({
      lostFoundId,
      reporterId,
      ...data,
    });
    return this.sightingRepo.save(sighting);
  }

  async getSightings(lostFoundId: string) {
    return this.sightingRepo.find({
      where: { lostFoundId },
      relations: ['reporter'],
      order: { sightedAt: 'DESC' },
    });
  }

  async delete(id: string, userId: string) {
    await this.lostFoundRepo.delete({ id, reporterId: userId });
  }
}
