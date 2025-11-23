import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Neighborhood } from './neighborhood.entity';

export enum VolunteerCategory {
  CLEANUP = 'CLEANUP',
  SAFETY_PATROL = 'SAFETY_PATROL',
  EVENT_HELP = 'EVENT_HELP',
  ELDERLY_ASSISTANCE = 'ELDERLY_ASSISTANCE',
  YOUTH_PROGRAMS = 'YOUTH_PROGRAMS',
  GARDENING = 'GARDENING',
  FOOD_DRIVE = 'FOOD_DRIVE',
  TUTORING = 'TUTORING',
  PET_CARE = 'PET_CARE',
  OTHER = 'OTHER',
}

export enum OpportunityStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SignupStatus {
  SIGNED_UP = 'SIGNED_UP',
  CONFIRMED = 'CONFIRMED',
  ATTENDED = 'ATTENDED',
  NO_SHOW = 'NO_SHOW',
  CANCELLED = 'CANCELLED',
}

@Entity('volunteer_opportunities')
export class VolunteerOpportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: VolunteerCategory })
  category: VolunteerCategory;

  @Column()
  location: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: 10 })
  volunteersNeeded: number;

  @Column({ default: 0 })
  volunteersSignedUp: number;

  @Column({ nullable: true })
  requirements: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ type: 'enum', enum: OpportunityStatus, default: OpportunityStatus.OPEN })
  status: OpportunityStatus;

  @Column('uuid')
  organizerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column('uuid', { nullable: true })
  neighborhoodId: string;

  @ManyToOne(() => Neighborhood)
  @JoinColumn({ name: 'neighborhoodId' })
  neighborhood: Neighborhood;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('volunteer_signups')
export class VolunteerSignup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  opportunityId: string;

  @ManyToOne(() => VolunteerOpportunity)
  @JoinColumn({ name: 'opportunityId' })
  opportunity: VolunteerOpportunity;

  @Column('uuid')
  volunteerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'volunteerId' })
  volunteer: User;

  @Column({ type: 'enum', enum: SignupStatus, default: SignupStatus.SIGNED_UP })
  status: SignupStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  hoursLogged: number;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('volunteer_hours')
export class VolunteerHours {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'decimal', precision: 7, scale: 2, default: 0 })
  totalHours: number;

  @Column({ default: 0 })
  opportunitiesCompleted: number;

  @Column({ nullable: true })
  currentBadge: string; // Bronze, Silver, Gold, Platinum

  @UpdateDateColumn()
  updatedAt: Date;
}
