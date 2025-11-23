import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, Conversation } from '../../database/entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Conversation) private conversationRepo: Repository<Conversation>,
  ) {}

  async getConversations(userId: string) {
    return this.conversationRepo.find({
      where: [{ participant1Id: userId }, { participant2Id: userId }],
      relations: ['participant1', 'participant2'],
      order: { lastMessageAt: 'DESC' },
    });
  }

  async getOrCreateConversation(userId: string, otherUserId: string) {
    let conversation = await this.conversationRepo.findOne({
      where: [
        { participant1Id: userId, participant2Id: otherUserId },
        { participant1Id: otherUserId, participant2Id: userId },
      ],
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        participant1Id: userId,
        participant2Id: otherUserId,
      });
      await this.conversationRepo.save(conversation);
    }

    return conversation;
  }

  async getMessages(conversationId: string, userId: string) {
    return this.messageRepo.find({
      where: { conversationId, isDeleted: false },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(senderId: string, recipientId: string, content: string) {
    const conversation = await this.getOrCreateConversation(senderId, recipientId);

    const message = this.messageRepo.create({
      senderId,
      recipientId,
      conversationId: conversation.id,
      content,
    });

    await this.messageRepo.save(message);

    // Update conversation
    conversation.lastMessageAt = new Date();
    conversation.lastMessagePreview = content.substring(0, 100);
    await this.conversationRepo.save(conversation);

    return message;
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.messageRepo.findOne({
      where: { id: messageId, recipientId: userId },
    });

    if (message) {
      message.isRead = true;
      message.readAt = new Date();
      await this.messageRepo.save(message);
    }

    return message;
  }

  async markConversationAsRead(conversationId: string, userId: string) {
    await this.messageRepo.update(
      { conversationId, recipientId: userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async getUnreadCount(userId: string) {
    return this.messageRepo.count({
      where: { recipientId: userId, isRead: false, isDeleted: false },
    });
  }

  async deleteMessage(messageId: string, userId: string) {
    await this.messageRepo.update(
      { id: messageId, senderId: userId },
      { isDeleted: true },
    );
  }
}
