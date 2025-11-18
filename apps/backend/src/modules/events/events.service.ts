import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../database/entities/event.entity';
import { RSVP } from '../../database/entities/rsvp.entity';
import { ICreateEventDto, IUpdateEventDto, RSVPStatus } from '@neighborhood/shared';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(RSVP)
    private rsvpRepository: Repository<RSVP>,
  ) {}

  async findUpcoming(neighborhoodId?: string, limit = 50) {
    const query = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .where('event.startTime > :now', { now: new Date() })
      .andWhere('event.status = :status', { status: 'upcoming' })
      .orderBy('event.startTime', 'ASC')
      .take(limit);

    if (neighborhoodId) {
      query.andWhere('event.neighborhoodId = :neighborhoodId', { neighborhoodId });
    }

    return query.getMany();
  }

  async findAll(neighborhoodId?: string) {
    const query = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .orderBy('event.startTime', 'DESC');

    if (neighborhoodId) {
      query.where('event.neighborhoodId = :neighborhoodId', { neighborhoodId });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer', 'rsvps', 'rsvps.user'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async create(createEventDto: ICreateEventDto, organizerId: string, neighborhoodId: string) {
    if (new Date(createEventDto.startTime) < new Date()) {
      throw new BadRequestException('Event start time must be in the future');
    }

    if (new Date(createEventDto.endTime) <= new Date(createEventDto.startTime)) {
      throw new BadRequestException('Event end time must be after start time');
    }

    const event = this.eventsRepository.create({
      ...createEventDto,
      organizerId,
      neighborhoodId,
      currentAttendees: 0,
    });

    return this.eventsRepository.save(event);
  }

  async update(id: string, updateEventDto: IUpdateEventDto, userId: string) {
    const event = await this.findOne(id);

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only edit your own events');
    }

    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: string, userId: string) {
    const event = await this.findOne(id);

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    await this.eventsRepository.remove(event);
  }

  async createRSVP(eventId: string, userId: string, status: RSVPStatus, guestCount = 0, comment?: string) {
    const event = await this.findOne(eventId);

    // Check if RSVP deadline has passed
    if (event.rsvpDeadline && new Date() > event.rsvpDeadline) {
      throw new BadRequestException('RSVP deadline has passed');
    }

    // Check if event is full
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees && status === RSVPStatus.GOING) {
      throw new BadRequestException('Event is full');
    }

    // Check if user already has an RSVP
    const existingRSVP = await this.rsvpRepository.findOne({
      where: { eventId, userId },
    });

    if (existingRSVP) {
      return this.updateRSVP(existingRSVP.id, userId, status, guestCount, comment);
    }

    const rsvp = this.rsvpRepository.create({
      eventId,
      userId,
      status,
      guestCount,
      comment,
    });

    await this.rsvpRepository.save(rsvp);

    // Update attendee count
    if (status === RSVPStatus.GOING) {
      event.currentAttendees += (1 + guestCount);
      await this.eventsRepository.save(event);
    }

    return rsvp;
  }

  async updateRSVP(rsvpId: string, userId: string, status?: RSVPStatus, guestCount?: number, comment?: string) {
    const rsvp = await this.rsvpRepository.findOne({
      where: { id: rsvpId },
      relations: ['event'],
    });

    if (!rsvp) {
      throw new NotFoundException(`RSVP with ID ${rsvpId} not found`);
    }

    if (rsvp.userId !== userId) {
      throw new ForbiddenException('You can only update your own RSVP');
    }

    const event = await this.findOne(rsvp.eventId);
    const oldStatus = rsvp.status;
    const oldGuestCount = rsvp.guestCount;

    if (status !== undefined) rsvp.status = status;
    if (guestCount !== undefined) rsvp.guestCount = guestCount;
    if (comment !== undefined) rsvp.comment = comment;

    await this.rsvpRepository.save(rsvp);

    // Update attendee count
    if (oldStatus === RSVPStatus.GOING && rsvp.status !== RSVPStatus.GOING) {
      event.currentAttendees -= (1 + oldGuestCount);
    } else if (oldStatus !== RSVPStatus.GOING && rsvp.status === RSVPStatus.GOING) {
      event.currentAttendees += (1 + (rsvp.guestCount || 0));
    } else if (rsvp.status === RSVPStatus.GOING && guestCount !== undefined) {
      event.currentAttendees += (guestCount - oldGuestCount);
    }

    await this.eventsRepository.save(event);

    return rsvp;
  }

  async deleteRSVP(rsvpId: string, userId: string) {
    const rsvp = await this.rsvpRepository.findOne({
      where: { id: rsvpId },
    });

    if (!rsvp) {
      throw new NotFoundException(`RSVP with ID ${rsvpId} not found`);
    }

    if (rsvp.userId !== userId) {
      throw new ForbiddenException('You can only delete your own RSVP');
    }

    const event = await this.findOne(rsvp.eventId);

    // Update attendee count
    if (rsvp.status === RSVPStatus.GOING) {
      event.currentAttendees -= (1 + rsvp.guestCount);
      await this.eventsRepository.save(event);
    }

    await this.rsvpRepository.remove(rsvp);
  }

  async getEventRSVPs(eventId: string) {
    return this.rsvpRepository.find({
      where: { eventId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserRSVPs(userId: string) {
    return this.rsvpRepository.find({
      where: { userId },
      relations: ['event', 'event.organizer'],
      order: { createdAt: 'DESC' },
    });
  }
}
