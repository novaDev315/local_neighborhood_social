import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity('event_photos')
export class EventPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  eventId: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column('uuid')
  uploaderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaderId' })
  uploader: User;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  caption: string;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: false })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('event_photo_likes')
export class EventPhotoLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  photoId: string;

  @ManyToOne(() => EventPhoto)
  @JoinColumn({ name: 'photoId' })
  photo: EventPhoto;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
