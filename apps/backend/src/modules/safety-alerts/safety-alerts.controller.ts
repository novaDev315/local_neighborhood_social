import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SafetyAlertsService } from './safety-alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICreateSafetyAlertDto, IUpdateSafetyAlertDto } from '@neighborhood/shared';

@ApiTags('safety')
@Controller('safety-alerts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SafetyAlertsController {
  constructor(private readonly safetyAlertsService: SafetyAlertsService) {}

  @ApiOperation({ summary: 'Get active safety alerts' })
  @Get('active')
  findActive(@Query('neighborhoodId') neighborhoodId?: string) {
    return this.safetyAlertsService.findActive(neighborhoodId);
  }

  @ApiOperation({ summary: 'Get all safety alerts' })
  @Get()
  findAll(@Query('neighborhoodId') neighborhoodId?: string) {
    return this.safetyAlertsService.findAll(neighborhoodId);
  }

  @ApiOperation({ summary: 'Get nearby alerts' })
  @Get('nearby')
  findNearby(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('radius') radius?: number,
  ) {
    return this.safetyAlertsService.findNearby(latitude, longitude, radius);
  }

  @ApiOperation({ summary: 'Get alert by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.safetyAlertsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create safety alert' })
  @Post()
  create(
    @Body() createAlertDto: ICreateSafetyAlertDto & { neighborhoodIds: string[] },
    @Request() req,
  ) {
    const { neighborhoodIds, ...alertData } = createAlertDto;
    return this.safetyAlertsService.create(alertData, req.user.userId, neighborhoodIds);
  }

  @ApiOperation({ summary: 'Update safety alert' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlertDto: IUpdateSafetyAlertDto,
    @Request() req,
  ) {
    return this.safetyAlertsService.update(id, updateAlertDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete safety alert' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.safetyAlertsService.remove(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Add update to alert' })
  @Post(':id/updates')
  addUpdate(
    @Param('id') alertId: string,
    @Body() body: { content: string },
    @Request() req,
  ) {
    return this.safetyAlertsService.addUpdate(alertId, req.user.userId, body.content);
  }

  @ApiOperation({ summary: 'Resolve alert' })
  @Patch(':id/resolve')
  resolve(@Param('id') id: string, @Request() req) {
    return this.safetyAlertsService.resolve(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Verify alert by authority (admin only)' })
  @Patch(':id/verify')
  verifyByAuthority(@Param('id') id: string, @Body() body: { authoritySource: string }) {
    return this.safetyAlertsService.verifyByAuthority(id, body.authoritySource);
  }
}
