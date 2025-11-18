import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceItem } from '../../database/entities/marketplace-item.entity';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MarketplaceItem])],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
