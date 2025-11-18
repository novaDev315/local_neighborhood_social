import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { NotificationType } from '@neighborhood/shared';
import { User } from './user.entity';

@Entity('notifications')
@Index(['userId', 'read', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, any>;

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  actionUrl?: string;

  @Column({ nullable: true })
  actorId?: string;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
