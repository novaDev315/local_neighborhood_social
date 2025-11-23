import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VolunteersService } from './volunteers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VolunteerCategory } from '../../database/entities/volunteer.entity';

@ApiTags('volunteers')
@Controller('volunteers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VolunteersController {
  constructor(private readonly service: VolunteersService) {}

  @ApiOperation({ summary: 'Get volunteer opportunities' })
  @Get('opportunities')
  findOpportunities(@Query('category') category?: VolunteerCategory) {
    return this.service.findOpportunities(category);
  }

  @ApiOperation({ summary: 'Get single opportunity' })
  @Get('opportunities/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Create volunteer opportunity' })
  @Post('opportunities')
  createOpportunity(@Body() body: any, @Request() req) {
    return this.service.createOpportunity(body, req.user.userId);
  }

  @ApiOperation({ summary: 'Update opportunity' })
  @Patch('opportunities/:id')
  updateOpportunity(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.service.updateOpportunity(id, body, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete opportunity' })
  @Delete('opportunities/:id')
  deleteOpportunity(@Param('id') id: string, @Request() req) {
    return this.service.deleteOpportunity(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Sign up for opportunity' })
  @Post('opportunities/:id/signup')
  signup(@Param('id') id: string, @Request() req) {
    return this.service.signup(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Cancel signup' })
  @Delete('opportunities/:id/signup')
  cancelSignup(@Param('id') id: string, @Request() req) {
    return this.service.cancelSignup(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Get signups for opportunity' })
  @Get('opportunities/:id/signups')
  getSignups(@Param('id') id: string) {
    return this.service.getSignups(id);
  }

  @ApiOperation({ summary: 'Get my signups' })
  @Get('my-signups')
  getMySignups(@Request() req) {
    return this.service.getMySignups(req.user.userId);
  }

  @ApiOperation({ summary: 'Log volunteer hours' })
  @Post('signups/:id/hours')
  logHours(@Param('id') id: string, @Body() body: { hours: number }, @Request() req) {
    return this.service.logHours(id, body.hours, req.user.userId);
  }

  @ApiOperation({ summary: 'Get my volunteer stats' })
  @Get('my-stats')
  getMyStats(@Request() req) {
    return this.service.getVolunteerStats(req.user.userId);
  }

  @ApiOperation({ summary: 'Get volunteer leaderboard' })
  @Get('leaderboard')
  getLeaderboard() {
    return this.service.getLeaderboard();
  }
}
