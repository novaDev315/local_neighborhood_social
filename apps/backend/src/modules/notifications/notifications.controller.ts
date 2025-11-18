import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Get all user notifications' })
  @Get()
  findByUser(@Request() req) {
    return this.notificationsService.findByUser(req.user.userId);
  }

  @ApiOperation({ summary: 'Get unread notifications' })
  @Get('unread')
  getUnread(@Request() req) {
    return this.notificationsService.getUnread(req.user.userId);
  }

  @ApiOperation({ summary: 'Get unread notification count' })
  @Get('count')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.userId);
    return { count };
  }

  @ApiOperation({ summary: 'Mark notification as read' })
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Mark notification as unread' })
  @Patch(':id/unread')
  markAsUnread(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsUnread(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Mark all notifications as read' })
  @Patch('mark-all-read')
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @ApiOperation({ summary: 'Delete notification' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.notificationsService.remove(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete all notifications' })
  @Delete()
  removeAll(@Request() req) {
    return this.notificationsService.removeAll(req.user.userId);
  }
}
