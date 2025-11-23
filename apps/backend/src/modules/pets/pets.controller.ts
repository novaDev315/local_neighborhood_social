import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetType } from '../../database/entities/pet.entity';

@ApiTags('pets')
@Controller('pets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PetsController {
  constructor(private readonly service: PetsService) {}

  @ApiOperation({ summary: 'Get all pets' })
  @Get()
  findAll(@Query('type') type?: PetType) {
    return this.service.findAll(type);
  }

  @ApiOperation({ summary: 'Get single pet' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Get my pets' })
  @Get('user/my-pets')
  getMyPets(@Request() req) {
    return this.service.findByOwner(req.user.userId);
  }

  @ApiOperation({ summary: 'Create pet profile' })
  @Post()
  create(@Body() body: any, @Request() req) {
    return this.service.create(body, req.user.userId);
  }

  @ApiOperation({ summary: 'Update pet profile' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.service.update(id, body, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete pet profile' })
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.service.delete(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Get pet playdates' })
  @Get('playdates/upcoming')
  findPlaydates(@Query('petType') petType?: PetType) {
    return this.service.findPlaydates(petType);
  }

  @ApiOperation({ summary: 'Create pet playdate' })
  @Post('playdates')
  createPlaydate(@Body() body: any, @Request() req) {
    return this.service.createPlaydate(body, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete pet playdate' })
  @Delete('playdates/:id')
  deletePlaydate(@Param('id') id: string, @Request() req) {
    return this.service.deletePlaydate(id, req.user.userId);
  }
}
