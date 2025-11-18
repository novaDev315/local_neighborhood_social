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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NeighborhoodsService } from './neighborhoods.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICreateNeighborhoodDto, IUpdateNeighborhoodDto } from '@neighborhood/shared';

@ApiTags('neighborhoods')
@Controller('neighborhoods')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NeighborhoodsController {
  constructor(private readonly neighborhoodsService: NeighborhoodsService) {}

  @ApiOperation({ summary: 'Get all neighborhoods' })
  @Get()
  findAll() {
    return this.neighborhoodsService.findAll();
  }

  @ApiOperation({ summary: 'Find nearby neighborhoods' })
  @Get('nearby')
  findNearby(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('distance') distance?: number,
  ) {
    return this.neighborhoodsService.findNearby(latitude, longitude, distance);
  }

  @ApiOperation({ summary: 'Find neighborhood for location' })
  @Get('for-location')
  findForLocation(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
  ) {
    return this.neighborhoodsService.findNeighborhoodForLocation(latitude, longitude);
  }

  @ApiOperation({ summary: 'Get neighborhood by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.neighborhoodsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get neighborhood statistics' })
  @Get(':id/statistics')
  getStatistics(@Param('id') id: string) {
    return this.neighborhoodsService.getStatistics(id);
  }

  @ApiOperation({ summary: 'Check if point is in neighborhood' })
  @Get(':id/contains')
  async isPointInNeighborhood(
    @Param('id') id: string,
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
  ) {
    const result = await this.neighborhoodsService.isPointInNeighborhood(id, latitude, longitude);
    return { contains: result };
  }

  @ApiOperation({ summary: 'Create neighborhood' })
  @Post()
  create(@Body() createNeighborhoodDto: ICreateNeighborhoodDto) {
    return this.neighborhoodsService.create(createNeighborhoodDto);
  }

  @ApiOperation({ summary: 'Update neighborhood' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNeighborhoodDto: IUpdateNeighborhoodDto,
  ) {
    return this.neighborhoodsService.update(id, updateNeighborhoodDto);
  }

  @ApiOperation({ summary: 'Delete neighborhood' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.neighborhoodsService.remove(id);
  }
}
