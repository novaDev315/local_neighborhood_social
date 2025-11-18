import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @Column()
  postId: string;

  @ManyToOne(() => User)
  author: User;

  @Column()
  authorId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  parentId?: string; // for nested comments

  @Column({ type: 'jsonb', default: { like: 0, love: 0, helpful: 0, thanks: 0, total: 0 } })
  reactions: {
    like: number;
    love: number;
    helpful: number;
    thanks: number;
    total: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
