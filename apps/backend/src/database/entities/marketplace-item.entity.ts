import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { MarketplaceCategory, MarketplaceItemStatus } from '@neighborhood/shared';
import { User } from './user.entity';
import { Neighborhood } from './neighborhood.entity';

@Entity('marketplace_items')
@Index(['neighborhoodId', 'status', 'createdAt'])
export class MarketplaceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  seller: User;

  @Column()
  sellerId: string;

  @ManyToOne(() => Neighborhood)
  neighborhood: Neighborhood;

  @Column()
  neighborhoodId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: MarketplaceCategory,
  })
  category: MarketplaceCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: false })
  isFree: boolean;

  @Column({ nullable: true })
  condition?: string;

  @Column({ type: 'simple-array' })
  images: string[];

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: string; // PostGIS Point

  @Column({ nullable: true })
  displayAddress?: string;

  @Column({
    type: 'enum',
    enum: MarketplaceItemStatus,
    default: MarketplaceItemStatus.AVAILABLE,
  })
  status: MarketplaceItemStatus;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  savedCount: number;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
