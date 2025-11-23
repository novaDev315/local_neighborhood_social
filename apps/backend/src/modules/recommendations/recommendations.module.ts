import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { ServiceRecommendation, ServiceReview } from '../../database/entities/recommendation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRecommendation, ServiceReview])],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
