import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { Pet, PetPlaydate } from '../../database/entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, PetPlaydate])],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
