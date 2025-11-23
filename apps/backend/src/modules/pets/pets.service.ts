import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet, PetPlaydate, PetType } from '../../database/entities/pet.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet) private petRepo: Repository<Pet>,
    @InjectRepository(PetPlaydate) private playdateRepo: Repository<PetPlaydate>,
  ) {}

  async findAll(type?: PetType) {
    const query = this.petRepo.createQueryBuilder('pet')
      .leftJoinAndSelect('pet.owner', 'owner')
      .where('pet.isVisible = :isVisible', { isVisible: true })
      .orderBy('pet.createdAt', 'DESC');
    if (type) query.andWhere('pet.type = :type', { type });
    return query.getMany();
  }

  async findOne(id: string) {
    return this.petRepo.findOne({ where: { id }, relations: ['owner'] });
  }

  async findByOwner(ownerId: string) {
    return this.petRepo.find({ where: { ownerId }, relations: ['owner'] });
  }

  async create(data: Partial<Pet>, ownerId: string) {
    const pet = this.petRepo.create({ ...data, ownerId });
    return this.petRepo.save(pet);
  }

  async update(id: string, data: Partial<Pet>, userId: string) {
    const pet = await this.petRepo.findOne({ where: { id, ownerId: userId } });
    if (!pet) return null;
    Object.assign(pet, data);
    return this.petRepo.save(pet);
  }

  async delete(id: string, userId: string) {
    await this.petRepo.delete({ id, ownerId: userId });
  }

  // Playdates
  async findPlaydates(petType?: PetType) {
    const query = this.playdateRepo.createQueryBuilder('pd')
      .leftJoinAndSelect('pd.organizer', 'organizer')
      .where('pd.dateTime > :now', { now: new Date() })
      .orderBy('pd.dateTime', 'ASC');
    if (petType) query.andWhere('pd.petTypeFilter = :petType', { petType });
    return query.getMany();
  }

  async createPlaydate(data: Partial<PetPlaydate>, organizerId: string) {
    const playdate = this.playdateRepo.create({ ...data, organizerId });
    return this.playdateRepo.save(playdate);
  }

  async deletePlaydate(id: string, userId: string) {
    await this.playdateRepo.delete({ id, organizerId: userId });
  }
}
