import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity('group_members')
@Index(['groupId', 'userId'], { unique: true })
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (group) => group.members)
  group: Group;

  @Column()
  groupId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column({ default: 'member' })
  role: 'admin' | 'moderator' | 'member';

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ nullable: true })
  invitedBy?: string;
}
