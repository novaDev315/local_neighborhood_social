import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SafetyAlertsService } from './safety-alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('safety')
@Controller('safety-alerts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SafetyAlertsController {
  constructor(private readonly safetyAlertsService: SafetyAlertsService) {}

  @Get('active')
  findActive() {
    return this.safetyAlertsService.findActive();
  }
}
