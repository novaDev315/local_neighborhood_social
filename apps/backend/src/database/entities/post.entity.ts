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
import { PostCategory, PostVisibility } from '@neighborhood/shared';
import { User } from './user.entity';
import { Neighborhood } from './neighborhood.entity';
import { Comment } from './comment.entity';

@Entity('posts')
@Index(['neighborhoodId', 'createdAt'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  author: User;

  @Column()
  authorId: string;

  @ManyToOne(() => Neighborhood)
  neighborhood: Neighborhood;

  @Column()
  neighborhoodId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: PostCategory,
    default: PostCategory.GENERAL,
  })
  category: PostCategory;

  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.NEIGHBORHOOD,
  })
  visibility: PostVisibility;

  @Column({ type: 'jsonb', nullable: true })
  media?: Array<{
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnailUrl?: string;
    caption?: string;
    metadata?: any;
  }>;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'jsonb', nullable: true })
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  @Column({ type: 'jsonb', default: { like: 0, love: 0, helpful: 0, thanks: 0, total: 0 } })
  reactions: {
    like: number;
    love: number;
    helpful: number;
    thanks: number;
    total: number;
  };

  @Column({ default: 0 })
  commentCount: number;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ default: false })
  isEdited: boolean;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
