export enum UserRole {
  RESIDENT = 'resident',
  BUSINESS_OWNER = 'business_owner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum VerificationMethod {
  POSTCARD = 'postcard',
  UTILITY_BILL = 'utility_bill',
  PROPERTY_RECORDS = 'property_records',
  LEASE_AGREEMENT = 'lease_agreement',
}

export enum PostCategory {
  GENERAL = 'general',
  SAFETY = 'safety',
  EVENT = 'event',
  RECOMMENDATION = 'recommendation',
  QUESTION = 'question',
  ANNOUNCEMENT = 'announcement',
}

export enum PostVisibility {
  BLOCK = 'block',
  STREET = 'street',
  NEIGHBORHOOD = 'neighborhood',
  PUBLIC = 'public',
}

export enum SafetyAlertType {
  CRIME = 'crime',
  WEATHER = 'weather',
  TRAFFIC = 'traffic',
  EMERGENCY = 'emergency',
  UTILITY = 'utility',
  OTHER = 'other',
}

export enum SafetyAlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

export enum MarketplaceItemStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  SOLD = 'sold',
  EXPIRED = 'expired',
}

export enum MarketplaceCategory {
  FURNITURE = 'furniture',
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  TOYS = 'toys',
  TOOLS = 'tools',
  GARDEN = 'garden',
  FREE = 'free',
  OTHER = 'other',
}

export enum BusinessCategory {
  RESTAURANT = 'restaurant',
  RETAIL = 'retail',
  SERVICES = 'services',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  AUTOMOTIVE = 'automotive',
  HOME_SERVICES = 'home_services',
  PROFESSIONAL = 'professional',
  OTHER = 'other',
}

export enum GroupPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SECRET = 'secret',
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum RSVPStatus {
  GOING = 'going',
  MAYBE = 'maybe',
  NOT_GOING = 'not_going',
}

export enum NotificationType {
  POST_COMMENT = 'post_comment',
  POST_REACTION = 'post_reaction',
  EVENT_REMINDER = 'event_reminder',
  EVENT_UPDATE = 'event_update',
  SAFETY_ALERT = 'safety_alert',
  MESSAGE = 'message',
  MARKETPLACE_INQUIRY = 'marketplace_inquiry',
  GROUP_INVITE = 'group_invite',
  SYSTEM = 'system',
}
