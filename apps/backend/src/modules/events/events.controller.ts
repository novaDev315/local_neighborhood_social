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
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICreateEventDto, IUpdateEventDto, RSVPStatus } from '@neighborhood/shared';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Get upcoming events' })
  @Get('upcoming')
  findUpcoming(
    @Query('neighborhoodId') neighborhoodId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.eventsService.findUpcoming(neighborhoodId, limit);
  }

  @ApiOperation({ summary: 'Get all events' })
  @Get()
  findAll(@Query('neighborhoodId') neighborhoodId?: string) {
    return this.eventsService.findAll(neighborhoodId);
  }

  @ApiOperation({ summary: 'Get event by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create new event' })
  @Post()
  create(@Body() createEventDto: ICreateEventDto, @Request() req) {
    return this.eventsService.create(
      createEventDto,
      req.user.userId,
      req.user.neighborhoodId,
    );
  }

  @ApiOperation({ summary: 'Update event' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: IUpdateEventDto,
    @Request() req,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete event' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Create or update RSVP' })
  @Post(':id/rsvp')
  createRSVP(
    @Param('id') eventId: string,
    @Body() body: { status: RSVPStatus; guestCount?: number; comment?: string },
    @Request() req,
  ) {
    return this.eventsService.createRSVP(
      eventId,
      req.user.userId,
      body.status,
      body.guestCount,
      body.comment,
    );
  }

  @ApiOperation({ summary: 'Delete RSVP' })
  @Delete('rsvp/:rsvpId')
  deleteRSVP(@Param('rsvpId') rsvpId: string, @Request() req) {
    return this.eventsService.deleteRSVP(rsvpId, req.user.userId);
  }

  @ApiOperation({ summary: 'Get event RSVPs' })
  @Get(':id/rsvps')
  getEventRSVPs(@Param('id') eventId: string) {
    return this.eventsService.getEventRSVPs(eventId);
  }

  @ApiOperation({ summary: 'Get user RSVPs' })
  @Get('user/rsvps')
  getUserRSVPs(@Request() req) {
    return this.eventsService.getUserRSVPs(req.user.userId);
  }
}
