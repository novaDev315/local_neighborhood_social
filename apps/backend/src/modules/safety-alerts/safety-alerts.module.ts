import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SafetyAlert } from '../../database/entities/safety-alert.entity';
import { SafetyAlertsService } from './safety-alerts.service';
import { SafetyAlertsController } from './safety-alerts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SafetyAlert])],
  controllers: [SafetyAlertsController],
  providers: [SafetyAlertsService],
  exports: [SafetyAlertsService],
})
export class SafetyAlertsModule {}
