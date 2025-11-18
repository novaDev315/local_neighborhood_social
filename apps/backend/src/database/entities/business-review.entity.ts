import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Business } from './business.entity';

@Entity('business_reviews')
@Index(['businessId', 'createdAt'])
export class BusinessReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Business, (business) => business.reviews)
  business: Business;

  @Column()
  businessId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  images?: string[];

  @Column({ default: 0 })
  helpful: number;

  @Column({ default: false })
  verifiedPurchase: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
