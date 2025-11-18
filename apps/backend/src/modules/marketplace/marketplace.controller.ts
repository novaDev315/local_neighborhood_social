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
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICreateMarketplaceItemDto, IUpdateMarketplaceItemDto, MarketplaceCategory } from '@neighborhood/shared';

@ApiTags('marketplace')
@Controller('marketplace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @ApiOperation({ summary: 'Get all marketplace items' })
  @Get()
  findAll(
    @Query('neighborhoodId') neighborhoodId?: string,
    @Query('category') category?: MarketplaceCategory,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.marketplaceService.findAll(neighborhoodId, category, limit, offset);
  }

  @ApiOperation({ summary: 'Search marketplace items' })
  @Get('search')
  search(
    @Query('q') query: string,
    @Query('neighborhoodId') neighborhoodId?: string,
  ) {
    return this.marketplaceService.search(query, neighborhoodId);
  }

  @ApiOperation({ summary: 'Get nearby items' })
  @Get('nearby')
  findNearby(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('radius') radius?: number,
  ) {
    return this.marketplaceService.findNearby(latitude, longitude, radius);
  }

  @ApiOperation({ summary: 'Get free items' })
  @Get('free')
  getFreeItems(@Query('neighborhoodId') neighborhoodId?: string) {
    return this.marketplaceService.getFreeItems(neighborhoodId);
  }

  @ApiOperation({ summary: 'Get seller items' })
  @Get('seller/:sellerId')
  getSellerItems(@Param('sellerId') sellerId: string) {
    return this.marketplaceService.getSellerItems(sellerId);
  }

  @ApiOperation({ summary: 'Get item by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne(id);
  }

  @ApiOperation({ summary: 'Create marketplace item' })
  @Post()
  create(
    @Body() createItemDto: ICreateMarketplaceItemDto & { location: { latitude: number; longitude: number } },
    @Request() req,
  ) {
    const { location, ...itemData } = createItemDto;
    return this.marketplaceService.create(
      itemData,
      req.user.userId,
      req.user.neighborhoodId,
      location,
    );
  }

  @ApiOperation({ summary: 'Update marketplace item' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: IUpdateMarketplaceItemDto,
    @Request() req,
  ) {
    return this.marketplaceService.update(id, updateItemDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete marketplace item' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.marketplaceService.remove(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Mark item as sold' })
  @Patch(':id/sold')
  markAsSold(@Param('id') id: string, @Request() req) {
    return this.marketplaceService.markAsSold(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Toggle save item' })
  @Post(':id/save')
  toggleSave(@Param('id') id: string) {
    return this.marketplaceService.toggleSave(id);
  }
}
