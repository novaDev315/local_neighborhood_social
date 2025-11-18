import { EventStatus, RSVPStatus } from '../enums';

export interface IEvent {
  id: string;
  organizerId: string;
  organizer?: {
    id: string;
    name: string;
    avatar?: string;
  };
  neighborhoodId: string;
  groupId?: string;
  title: string;
  description: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    placeName?: string;
  };
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  recurrenceRule?: string; // iCal RRULE format
  maxAttendees?: number;
  currentAttendees: number;
  rsvpDeadline?: Date;
  status: EventStatus;
  coverImage?: string;
  tags?: string[];
  isPublic: boolean;
  allowGuestInvites: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRSVP {
  id: string;
  eventId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: RSVPStatus;
  guestCount: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateEventDto {
  title: string;
  description: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    placeName?: string;
  };
  startTime: Date;
  endTime: Date;
  maxAttendees?: number;
  rsvpDeadline?: Date;
  coverImage?: string;
  tags?: string[];
  isPublic?: boolean;
  allowGuestInvites?: boolean;
  groupId?: string;
}

export interface IUpdateEventDto {
  title?: string;
  description?: string;
  category?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    placeName?: string;
  };
  startTime?: Date;
  endTime?: Date;
  maxAttendees?: number;
  status?: EventStatus;
  coverImage?: string;
  tags?: string[];
}
