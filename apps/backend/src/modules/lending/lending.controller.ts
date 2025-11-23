import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LendingService } from './lending.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LendingCategory } from '../../database/entities/lending.entity';

@ApiTags('lending')
@Controller('lending')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LendingController {
  constructor(private readonly service: LendingService) {}

  @ApiOperation({ summary: 'Get all lending items' })
  @Get()
  findAll(@Query('category') category?: LendingCategory) {
    return this.service.findAllItems(category);
  }

  @ApiOperation({ summary: 'Get available items' })
  @Get('available')
  findAvailable() {
    return this.service.findAvailable();
  }

  @ApiOperation({ summary: 'Get single item' })
  @Get('items/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Create lending item' })
  @Post('items')
  createItem(@Body() body: any, @Request() req) {
    return this.service.createItem(body, req.user.userId);
  }

  @ApiOperation({ summary: 'Update lending item' })
  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.service.updateItem(id, body, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete lending item' })
  @Delete('items/:id')
  deleteItem(@Param('id') id: string, @Request() req) {
    return this.service.deleteItem(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Request to borrow item' })
  @Post('items/:id/borrow')
  requestBorrow(@Param('id') id: string, @Body() body: { startDate: Date; endDate: Date; message?: string }, @Request() req) {
    return this.service.requestBorrow(id, req.user.userId, body);
  }

  @ApiOperation({ summary: 'Get my borrow requests' })
  @Get('my-requests')
  getMyRequests(@Request() req) {
    return this.service.getMyRequests(req.user.userId);
  }

  @ApiOperation({ summary: 'Get requests for my items' })
  @Get('incoming-requests')
  getIncomingRequests(@Request() req) {
    return this.service.getRequestsForMyItems(req.user.userId);
  }

  @ApiOperation({ summary: 'Approve borrow request' })
  @Patch('requests/:id/approve')
  approveRequest(@Param('id') id: string, @Request() req) {
    return this.service.approveRequest(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Reject borrow request' })
  @Patch('requests/:id/reject')
  rejectRequest(@Param('id') id: string, @Request() req) {
    return this.service.rejectRequest(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Mark item as returned' })
  @Patch('requests/:id/return')
  returnItem(@Param('id') id: string, @Body() body: { notes?: string }, @Request() req) {
    return this.service.returnItem(id, req.user.userId, body.notes);
  }
}
