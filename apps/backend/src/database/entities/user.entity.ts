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
import { UserRole, VerificationStatus } from '@neighborhood/shared';
import { Neighborhood } from './neighborhood.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.RESIDENT,
  })
  role: UserRole;

  @Column({ default: false })
  addressVerified: boolean;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location?: string; // PostGIS Point

  @Column({ type: 'jsonb', nullable: true })
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Column({ type: 'simple-array', nullable: true })
  skills?: string[];

  @Column({ type: 'simple-array', nullable: true })
  interests?: string[];

  @Column({ type: 'jsonb', default: {} })
  privacySettings: {
    showExactAddress: boolean;
    showPhone: boolean;
    showEmail: boolean;
    allowMessages: boolean;
    allowGroupInvites: boolean;
    visibleToNeighborsOnly: boolean;
  };

  @ManyToOne(() => Neighborhood, { nullable: true })
  neighborhood?: Neighborhood;

  @Column({ nullable: true })
  neighborhoodId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActiveAt?: Date;
}
