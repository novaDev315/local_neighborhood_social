import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LendingItem, BorrowRequest, LendingStatus, BorrowRequestStatus, LendingCategory } from '../../database/entities/lending.entity';

@Injectable()
export class LendingService {
  constructor(
    @InjectRepository(LendingItem) private itemRepo: Repository<LendingItem>,
    @InjectRepository(BorrowRequest) private requestRepo: Repository<BorrowRequest>,
  ) {}

  async findAllItems(category?: LendingCategory) {
    const query = this.itemRepo.createQueryBuilder('item')
      .leftJoinAndSelect('item.owner', 'owner')
      .where('item.status != :unavailable', { unavailable: LendingStatus.UNAVAILABLE })
      .orderBy('item.createdAt', 'DESC');

    if (category) query.andWhere('item.category = :category', { category });
    return query.getMany();
  }

  async findAvailable() {
    return this.itemRepo.find({ where: { status: LendingStatus.AVAILABLE }, relations: ['owner'] });
  }

  async findOne(id: string) {
    return this.itemRepo.findOne({ where: { id }, relations: ['owner'] });
  }

  async createItem(data: Partial<LendingItem>, ownerId: string) {
    const item = this.itemRepo.create({ ...data, ownerId });
    return this.itemRepo.save(item);
  }

  async updateItem(id: string, data: Partial<LendingItem>, userId: string) {
    const item = await this.itemRepo.findOne({ where: { id, ownerId: userId } });
    if (!item) return null;
    Object.assign(item, data);
    return this.itemRepo.save(item);
  }

  async requestBorrow(itemId: string, borrowerId: string, data: { startDate: Date; endDate: Date; message?: string }) {
    const request = this.requestRepo.create({ itemId, borrowerId, ...data });
    return this.requestRepo.save(request);
  }

  async getRequestsForItem(itemId: string) {
    return this.requestRepo.find({ where: { itemId }, relations: ['borrower'], order: { createdAt: 'DESC' } });
  }

  async getMyRequests(userId: string) {
    return this.requestRepo.find({ where: { borrowerId: userId }, relations: ['item', 'item.owner'], order: { createdAt: 'DESC' } });
  }

  async getRequestsForMyItems(userId: string) {
    return this.requestRepo.createQueryBuilder('req')
      .leftJoinAndSelect('req.item', 'item')
      .leftJoinAndSelect('req.borrower', 'borrower')
      .where('item.ownerId = :userId', { userId })
      .orderBy('req.createdAt', 'DESC')
      .getMany();
  }

  async approveRequest(requestId: string, userId: string) {
    const request = await this.requestRepo.findOne({ where: { id: requestId }, relations: ['item'] });
    if (!request || request.item.ownerId !== userId) return null;
    request.status = BorrowRequestStatus.APPROVED;
    await this.requestRepo.save(request);
    await this.itemRepo.update(request.itemId, { status: LendingStatus.BORROWED });
    return request;
  }

  async rejectRequest(requestId: string, userId: string) {
    const request = await this.requestRepo.findOne({ where: { id: requestId }, relations: ['item'] });
    if (!request || request.item.ownerId !== userId) return null;
    request.status = BorrowRequestStatus.REJECTED;
    return this.requestRepo.save(request);
  }

  async returnItem(requestId: string, userId: string, notes?: string) {
    const request = await this.requestRepo.findOne({ where: { id: requestId }, relations: ['item'] });
    if (!request || (request.borrowerId !== userId && request.item.ownerId !== userId)) return null;
    request.status = BorrowRequestStatus.RETURNED;
    request.returnedAt = new Date();
    request.returnNotes = notes;
    await this.requestRepo.save(request);
    await this.itemRepo.update(request.itemId, { status: LendingStatus.AVAILABLE });
    return request;
  }

  async deleteItem(id: string, userId: string) {
    await this.itemRepo.update({ id, ownerId: userId }, { status: LendingStatus.UNAVAILABLE });
  }
}
