import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SafetyAlert } from '../../database/entities/safety-alert.entity';

@Injectable()
export class SafetyAlertsService {
  constructor(
    @InjectRepository(SafetyAlert)
    private alertsRepository: Repository<SafetyAlert>,
  ) {}

  async findActive() {
    return this.alertsRepository.find({
      where: { status: 'active' },
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });
  }

  // TODO: Implement alert creation with notification
  // TODO: Implement geographic targeting
  // TODO: Implement authority verification
  // TODO: Implement push notifications
}
