import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { RSVPStatus } from '@neighborhood/shared';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity('rsvps')
@Index(['eventId', 'userId'], { unique: true })
export class RSVP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.rsvps)
  event: Event;

  @Column()
  eventId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: RSVPStatus,
    default: RSVPStatus.GOING,
  })
  status: RSVPStatus;

  @Column({ default: 0 })
  guestCount: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
