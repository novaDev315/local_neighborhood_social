import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LendingController } from './lending.controller';
import { LendingService } from './lending.service';
import { LendingItem, BorrowRequest } from '../../database/entities/lending.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LendingItem, BorrowRequest])],
  controllers: [LendingController],
  providers: [LendingService],
  exports: [LendingService],
})
export class LendingModule {}
