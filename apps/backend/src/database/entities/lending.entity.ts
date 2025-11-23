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

export enum LendingCategory {
  TOOLS = 'TOOLS',
  GARDEN = 'GARDEN',
  KITCHEN = 'KITCHEN',
  SPORTS = 'SPORTS',
  ELECTRONICS = 'ELECTRONICS',
  PARTY = 'PARTY',
  BABY = 'BABY',
  AUTOMOTIVE = 'AUTOMOTIVE',
  OTHER = 'OTHER',
}

export enum LendingStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum BorrowRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

@Entity('lending_items')
export class LendingItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: LendingCategory })
  category: LendingCategory;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ type: 'enum', enum: LendingStatus, default: LendingStatus.AVAILABLE })
  status: LendingStatus;

  @Column({ nullable: true })
  condition: string;

  @Column({ nullable: true })
  instructions: string;

  @Column({ default: 7 })
  maxLendDays: number;

  @Column({ default: true })
  requiresDeposit: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  depositAmount: number;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

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

@Entity('borrow_requests')
export class BorrowRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  itemId: string;

  @ManyToOne(() => LendingItem)
  @JoinColumn({ name: 'itemId' })
  item: LendingItem;

  @Column('uuid')
  borrowerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'borrowerId' })
  borrower: User;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column('text', { nullable: true })
  message: string;

  @Column({ type: 'enum', enum: BorrowRequestStatus, default: BorrowRequestStatus.PENDING })
  status: BorrowRequestStatus;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt: Date;

  @Column('text', { nullable: true })
  returnNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
