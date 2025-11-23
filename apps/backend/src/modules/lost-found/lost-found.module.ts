import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostFoundController } from './lost-found.controller';
import { LostFoundService } from './lost-found.service';
import { LostFound, LostFoundSighting } from '../../database/entities/lost-found.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LostFound, LostFoundSighting])],
  controllers: [LostFoundController],
  providers: [LostFoundService],
  exports: [LostFoundService],
})
export class LostFoundModule {}
