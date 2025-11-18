import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '../../database/entities/business.entity';
import { BusinessReview } from '../../database/entities/business-review.entity';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Business, BusinessReview])],
  controllers: [BusinessesController],
  providers: [BusinessesService],
  exports: [BusinessesService],
})
export class BusinessesModule {}
