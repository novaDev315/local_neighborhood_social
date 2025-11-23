import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteersController } from './volunteers.controller';
import { VolunteersService } from './volunteers.service';
import { VolunteerOpportunity, VolunteerSignup, VolunteerHours } from '../../database/entities/volunteer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VolunteerOpportunity, VolunteerSignup, VolunteerHours])],
  controllers: [VolunteersController],
  providers: [VolunteersService],
  exports: [VolunteersService],
})
export class VolunteersModule {}
