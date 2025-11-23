import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Get all conversations' })
  @Get('conversations')
  getConversations(@Request() req) {
    return this.messagesService.getConversations(req.user.userId);
  }

  @ApiOperation({ summary: 'Get messages in a conversation' })
  @Get('conversations/:conversationId')
  getMessages(@Param('conversationId') conversationId: string, @Request() req) {
    return this.messagesService.getMessages(conversationId, req.user.userId);
  }

  @ApiOperation({ summary: 'Send a message' })
  @Post()
  sendMessage(
    @Body() body: { recipientId: string; content: string },
    @Request() req,
  ) {
    return this.messagesService.sendMessage(
      req.user.userId,
      body.recipientId,
      body.content,
    );
  }

  @ApiOperation({ summary: 'Mark message as read' })
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.messagesService.markAsRead(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Mark all messages in conversation as read' })
  @Patch('conversations/:conversationId/read')
  markConversationAsRead(
    @Param('conversationId') conversationId: string,
    @Request() req,
  ) {
    return this.messagesService.markConversationAsRead(
      conversationId,
      req.user.userId,
    );
  }

  @ApiOperation({ summary: 'Get unread message count' })
  @Get('unread/count')
  async getUnreadCount(@Request() req) {
    const count = await this.messagesService.getUnreadCount(req.user.userId);
    return { count };
  }

  @ApiOperation({ summary: 'Delete a message' })
  @Delete(':id')
  deleteMessage(@Param('id') id: string, @Request() req) {
    return this.messagesService.deleteMessage(id, req.user.userId);
  }
}
