import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { SafetyAlertType, SafetyAlertSeverity } from '@neighborhood/shared';
import { User } from './user.entity';

@Entity('safety_alerts')
@Index(['createdAt'])
export class SafetyAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  author: User;

  @Column()
  authorId: string;

  @Column({ type: 'simple-array' })
  neighborhoodIds: string[];

  @Column({
    type: 'enum',
    enum: SafetyAlertType,
  })
  type: SafetyAlertType;

  @Column({
    type: 'enum',
    enum: SafetyAlertSeverity,
    default: SafetyAlertSeverity.INFO,
  })
  severity: SafetyAlertSeverity;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  @Column({ type: 'int', nullable: true })
  radius?: number; // in meters

  @Column({ type: 'simple-array', nullable: true })
  images?: string[];

  @Column({ default: false })
  verifiedByAuthority: boolean;

  @Column({ nullable: true })
  authoritySource?: string;

  @Column({ type: 'timestamp', nullable: true })
  incidentTime?: Date;

  @Column({ default: 'active' })
  status: 'active' | 'resolved' | 'expired';

  @Column({ type: 'jsonb', nullable: true })
  updates?: Array<{
    id: string;
    authorId: string;
    content: string;
    timestamp: Date;
  }>;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
