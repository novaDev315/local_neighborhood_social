import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NeighborhoodsService } from './neighborhoods.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('neighborhoods')
@Controller('neighborhoods')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NeighborhoodsController {
  constructor(private readonly neighborhoodsService: NeighborhoodsService) {}

  @Get()
  findAll() {
    return this.neighborhoodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.neighborhoodsService.findOne(id);
  }
}
