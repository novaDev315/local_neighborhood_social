import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../database/entities/event.entity';
import { RSVP } from '../../database/entities/rsvp.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(RSVP)
    private rsvpRepository: Repository<RSVP>,
  ) {}

  async findUpcoming(neighborhoodId?: string) {
    const query = this.eventsRepository
      .createQueryBuilder('event')
      .where('event.startTime > :now', { now: new Date() })
      .orderBy('event.startTime', 'ASC');

    if (neighborhoodId) {
      query.andWhere('event.neighborhoodId = :neighborhoodId', { neighborhoodId });
    }

    return query.getMany();
  }

  // TODO: Implement event creation and RSVP
  // TODO: Implement calendar integration
  // TODO: Implement recurring events
  // TODO: Implement event reminders
}
