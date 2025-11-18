import { NotificationType } from '../enums';

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  actionUrl?: string;
  actorId?: string;
  actor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  readAt?: Date;
}

export interface INotificationPreferences {
  userId: string;
  email: {
    postComments: boolean;
    postReactions: boolean;
    eventReminders: boolean;
    eventUpdates: boolean;
    safetyAlerts: boolean;
    messages: boolean;
    marketplaceInquiries: boolean;
    groupInvites: boolean;
    weeklyDigest: boolean;
  };
  push: {
    postComments: boolean;
    postReactions: boolean;
    eventReminders: boolean;
    eventUpdates: boolean;
    safetyAlerts: boolean;
    messages: boolean;
    marketplaceInquiries: boolean;
    groupInvites: boolean;
  };
  sms: {
    safetyAlerts: boolean;
    eventReminders: boolean;
  };
}
