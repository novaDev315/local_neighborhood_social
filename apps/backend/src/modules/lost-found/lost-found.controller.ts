import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LostFoundService } from './lost-found.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LostFoundType } from '../../database/entities/lost-found.entity';

@ApiTags('lost-found')
@Controller('lost-found')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LostFoundController {
  constructor(private readonly lostFoundService: LostFoundService) {}

  @ApiOperation({ summary: 'Get all lost and found posts' })
  @Get()
  findAll(@Query('type') type?: LostFoundType) {
    return this.lostFoundService.findAll(type);
  }

  @ApiOperation({ summary: 'Get lost pets only' })
  @Get('lost-pets')
  findLostPets() {
    return this.lostFoundService.findLostPets();
  }

  @ApiOperation({ summary: 'Get found pets only' })
  @Get('found-pets')
  findFoundPets() {
    return this.lostFoundService.findFoundPets();
  }

  @ApiOperation({ summary: 'Get single lost/found post' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lostFoundService.findOne(id);
  }

  @ApiOperation({ summary: 'Create lost/found post' })
  @Post()
  create(@Body() body: any, @Request() req) {
    return this.lostFoundService.create(body, req.user.userId);
  }

  @ApiOperation({ summary: 'Update lost/found post' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.lostFoundService.update(id, body, req.user.userId);
  }

  @ApiOperation({ summary: 'Mark as reunited' })
  @Patch(':id/reunited')
  markAsReunited(@Param('id') id: string, @Request() req) {
    return this.lostFoundService.markAsReunited(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Close post' })
  @Patch(':id/close')
  close(@Param('id') id: string, @Request() req) {
    return this.lostFoundService.close(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Add sighting report' })
  @Post(':id/sightings')
  addSighting(
    @Param('id') id: string,
    @Body() body: { location: string; description: string; sightedAt: Date },
    @Request() req,
  ) {
    return this.lostFoundService.addSighting(id, req.user.userId, body);
  }

  @ApiOperation({ summary: 'Get sightings for post' })
  @Get(':id/sightings')
  getSightings(@Param('id') id: string) {
    return this.lostFoundService.getSightings(id);
  }

  @ApiOperation({ summary: 'Delete post' })
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.lostFoundService.delete(id, req.user.userId);
  }
}
