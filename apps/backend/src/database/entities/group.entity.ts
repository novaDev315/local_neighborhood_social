import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { GroupPrivacy } from '@neighborhood/shared';
import { User } from './user.entity';
import { Neighborhood } from './neighborhood.entity';
import { GroupMember } from './group-member.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: GroupPrivacy,
    default: GroupPrivacy.PUBLIC,
  })
  privacy: GroupPrivacy;

  @ManyToOne(() => Neighborhood)
  neighborhood: Neighborhood;

  @Column()
  neighborhoodId: string;

  @ManyToOne(() => User)
  creator: User;

  @Column()
  creatorId: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column()
  category: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ default: 0 })
  memberCount: number;

  @Column({ default: 0 })
  postCount: number;

  @Column({ type: 'simple-array', nullable: true })
  rules?: string[];

  @Column({ type: 'jsonb', default: {} })
  settings: {
    requireApproval: boolean;
    allowMemberPosts: boolean;
    allowMemberInvites: boolean;
    allowEvents: boolean;
    allowPolls: boolean;
  };

  @OneToMany(() => GroupMember, (member) => member.group)
  members: GroupMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
