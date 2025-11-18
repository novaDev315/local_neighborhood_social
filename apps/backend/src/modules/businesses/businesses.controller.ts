import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('businesses')
@Controller('businesses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  findAll() {
    return this.businessesService.findAll();
  }
}
