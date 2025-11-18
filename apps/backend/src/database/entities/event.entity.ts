import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { EventStatus } from '@neighborhood/shared';
import { User } from './user.entity';
import { Neighborhood } from './neighborhood.entity';
import { RSVP } from './rsvp.entity';

@Entity('events')
@Index(['neighborhoodId', 'startTime'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  organizer: User;

  @Column()
  organizerId: string;

  @ManyToOne(() => Neighborhood)
  neighborhood: Neighborhood;

  @Column()
  neighborhoodId: string;

  @Column({ nullable: true })
  groupId?: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column({ type: 'jsonb' })
  location: {
    latitude: number;
    longitude: number;
    address: string;
    placeName?: string;
  };

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurrenceRule?: string;

  @Column({ type: 'int', nullable: true })
  maxAttendees?: number;

  @Column({ default: 0 })
  currentAttendees: number;

  @Column({ type: 'timestamp', nullable: true })
  rsvpDeadline?: Date;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.UPCOMING,
  })
  status: EventStatus;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: true })
  allowGuestInvites: boolean;

  @OneToMany(() => RSVP, (rsvp) => rsvp.event)
  rsvps: RSVP[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
