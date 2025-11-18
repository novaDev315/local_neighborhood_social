import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neighborhood } from '../../database/entities/neighborhood.entity';
import { NeighborhoodsService } from './neighborhoods.service';
import { NeighborhoodsController } from './neighborhoods.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Neighborhood])],
  controllers: [NeighborhoodsController],
  providers: [NeighborhoodsService],
  exports: [NeighborhoodsService],
})
export class NeighborhoodsModule {}
