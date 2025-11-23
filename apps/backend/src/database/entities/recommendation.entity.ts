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

export enum ServiceCategory {
  PLUMBER = 'PLUMBER',
  ELECTRICIAN = 'ELECTRICIAN',
  HANDYMAN = 'HANDYMAN',
  LANDSCAPING = 'LANDSCAPING',
  CLEANING = 'CLEANING',
  PAINTING = 'PAINTING',
  ROOFING = 'ROOFING',
  HVAC = 'HVAC',
  PEST_CONTROL = 'PEST_CONTROL',
  APPLIANCE_REPAIR = 'APPLIANCE_REPAIR',
  AUTO_MECHANIC = 'AUTO_MECHANIC',
  PET_SERVICES = 'PET_SERVICES',
  CHILDCARE = 'CHILDCARE',
  TUTORING = 'TUTORING',
  OTHER = 'OTHER',
}

@Entity('service_recommendations')
export class ServiceRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  providerName: string;

  @Column({ type: 'enum', enum: ServiceCategory })
  category: ServiceCategory;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalReviews: number;

  @Column({ nullable: true })
  priceRange: string; // $, $$, $$$

  @Column({ default: true })
  isActive: boolean;

  @Column('uuid')
  recommenderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recommenderId' })
  recommender: User;

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

@Entity('service_reviews')
export class ServiceReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  recommendationId: string;

  @ManyToOne(() => ServiceRecommendation)
  @JoinColumn({ name: 'recommendationId' })
  recommendation: ServiceRecommendation;

  @Column('uuid')
  reviewerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User;

  @Column({ type: 'int' })
  rating: number; // 1-5

  @Column('text')
  comment: string;

  @Column({ nullable: true })
  serviceDate: Date;

  @Column({ default: 0 })
  helpfulCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
