import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BusinessCategory } from '@neighborhood/shared';
import { User } from './user.entity';
import { BusinessReview } from './business-review.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  owner: User;

  @Column()
  ownerId: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: BusinessCategory,
  })
  category: BusinessCategory;

  @Column({ type: 'simple-array', nullable: true })
  subcategories?: string[];

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: string; // PostGIS Point

  @Column({ type: 'jsonb' })
  locationData: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  hours?: Array<{
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }>;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  priceRange?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ type: 'simple-array', nullable: true })
  images?: string[];

  @Column({ type: 'simple-array', nullable: true })
  amenities?: string[];

  @Column({ type: 'jsonb', nullable: true })
  specialOffers?: Array<{
    id: string;
    title: string;
    description: string;
    discountPercent?: number;
    validFrom: Date;
    validUntil: Date;
    terms?: string;
  }>;

  @Column({ type: 'simple-array' })
  neighborhoodIds: string[];

  @Column({ type: 'timestamp', nullable: true })
  claimedAt?: Date;

  @OneToMany(() => BusinessReview, (review) => review.business)
  reviews: BusinessReview[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
