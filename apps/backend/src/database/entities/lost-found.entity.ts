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

export enum LostFoundType {
  LOST_PET = 'LOST_PET',
  FOUND_PET = 'FOUND_PET',
  LOST_ITEM = 'LOST_ITEM',
  FOUND_ITEM = 'FOUND_ITEM',
}

export enum LostFoundStatus {
  ACTIVE = 'ACTIVE',
  REUNITED = 'REUNITED',
  CLOSED = 'CLOSED',
}

@Entity('lost_found')
export class LostFound {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LostFoundType })
  type: LostFoundType;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  petName: string;

  @Column({ nullable: true })
  petType: string; // dog, cat, bird, etc.

  @Column({ nullable: true })
  breed: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  size: string; // small, medium, large

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column()
  lastSeenLocation: string;

  @Column({ type: 'timestamp' })
  lastSeenDate: Date;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  reward: string;

  @Column({ type: 'enum', enum: LostFoundStatus, default: LostFoundStatus.ACTIVE })
  status: LostFoundStatus;

  @Column('uuid')
  reporterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

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

@Entity('lost_found_sightings')
export class LostFoundSighting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  lostFoundId: string;

  @ManyToOne(() => LostFound)
  @JoinColumn({ name: 'lostFoundId' })
  lostFound: LostFound;

  @Column('uuid')
  reporterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @Column()
  location: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp' })
  sightedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
