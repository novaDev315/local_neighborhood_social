import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('neighborhoods')
export class Neighborhood {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  boundary: string; // PostGIS Polygon

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  centerPoint: string; // PostGIS Point

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ type: 'simple-array' })
  zipCodes: string[];

  @Column({ default: 0 })
  memberCount: number;

  @Column({ type: 'int', nullable: true })
  radius?: number; // in meters

  @Column({ type: 'jsonb', default: {} })
  settings: {
    requireAddressVerification: boolean;
    allowPublicPosts: boolean;
    moderationEnabled: boolean;
    autoJoinEnabled: boolean;
  };

  @OneToMany(() => User, (user) => user.neighborhood)
  members: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
