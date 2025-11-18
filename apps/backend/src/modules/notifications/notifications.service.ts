import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../database/entities/notification.entity';
import { NotificationType } from '@neighborhood/shared';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async findByUser(userId: string, limit = 50, offset = 0) {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findUnread(userId: string) {
    return this.notificationsRepository.find({
      where: { userId, read: false },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, read: false },
    });
  }

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>,
    actionUrl?: string,
    actorId?: string,
  ) {
    const notification = this.notificationsRepository.create({
      userId,
      type,
      title,
      message,
      data,
      actionUrl,
      actorId,
      read: false,
    });

    const saved = await this.notificationsRepository.save(notification);

    // TODO: In production, trigger push notification via WebSocket or OneSignal
    // TODO: In production, send email if user preferences allow

    return saved;
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      return null;
    }

    notification.read = true;
    notification.readAt = new Date();

    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.notificationsRepository.update(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );

    return { message: 'All notifications marked as read' };
  }

  async delete(id: string, userId: string) {
    const result = await this.notificationsRepository.delete({ id, userId });
    return result.affected > 0;
  }

  async deleteAll(userId: string) {
    await this.notificationsRepository.delete({ userId });
    return { message: 'All notifications deleted' };
  }

  // Notification creation helpers for different events
  async createPostCommentNotification(postAuthorId: string, commentAuthorId: string, postId: string) {
    if (postAuthorId === commentAuthorId) return; // Don't notify yourself

    return this.create(
      postAuthorId,
      NotificationType.POST_COMMENT,
      'New comment on your post',
      'Someone commented on your post',
      { postId, commentAuthorId },
      `/posts/${postId}`,
      commentAuthorId,
    );
  }

  async createEventReminderNotification(userId: string, eventId: string, eventTitle: string) {
    return this.create(
      userId,
      NotificationType.EVENT_REMINDER,
      'Event reminder',
      `Upcoming event: ${eventTitle}`,
      { eventId },
      `/events/${eventId}`,
    );
  }

  async createSafetyAlertNotification(userId: string, alertId: string, alertTitle: string) {
    return this.create(
      userId,
      NotificationType.SAFETY_ALERT,
      'Safety Alert',
      alertTitle,
      { alertId },
      `/safety-alerts/${alertId}`,
    );
  }

  async createGroupInviteNotification(userId: string, groupId: string, groupName: string, inviterId: string) {
    return this.create(
      userId,
      NotificationType.GROUP_INVITE,
      'Group invitation',
      `You've been invited to join ${groupName}`,
      { groupId },
      `/groups/${groupId}`,
      inviterId,
    );
  }

  async createMarketplaceInquiryNotification(sellerId: string, itemId: string, buyerId: string) {
    return this.create(
      sellerId,
      NotificationType.MARKETPLACE_INQUIRY,
      'New marketplace inquiry',
      'Someone is interested in your item',
      { itemId, buyerId },
      `/marketplace/${itemId}`,
      buyerId,
    );
  }
}
