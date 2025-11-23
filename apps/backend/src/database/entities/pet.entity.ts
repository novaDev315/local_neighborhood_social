import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Neighborhood } from './neighborhood.entity';

export enum PetType {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  FISH = 'FISH',
  RABBIT = 'RABBIT',
  HAMSTER = 'HAMSTER',
  REPTILE = 'REPTILE',
  OTHER = 'OTHER',
}

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PetType })
  type: PetType;

  @Column({ nullable: true })
  breed: string;

  @Column({ nullable: true })
  age: string; // e.g., "2 years", "6 months"

  @Column({ nullable: true })
  color: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ default: false })
  isVaccinated: boolean;

  @Column({ default: false })
  isNeutered: boolean;

  @Column({ default: false })
  isFriendlyWithKids: boolean;

  @Column({ default: false })
  isFriendlyWithPets: boolean;

  @Column({ default: true })
  isVisible: boolean;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column('uuid', { nullable: true })
  neighborhoodId: string;

  @ManyToOne(() => Neighborhood)
  @JoinColumn({ name: 'neighborhoodId' })
  neighborhood: Neighborhood;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('pet_playdates')
export class PetPlaydate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  location: string;

  @Column({ type: 'timestamp' })
  dateTime: Date;

  @Column({ type: 'enum', enum: PetType, nullable: true })
  petTypeFilter: PetType;

  @Column('uuid')
  organizerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column('uuid', { nullable: true })
  neighborhoodId: string;

  @ManyToOne(() => Neighborhood)
  @JoinColumn({ name: 'neighborhoodId' })
  neighborhood: Neighborhood;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
