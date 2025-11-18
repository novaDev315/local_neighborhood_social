import { SafetyAlertType, SafetyAlertSeverity } from '../enums';

export interface ISafetyAlert {
  id: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  neighborhoodIds: string[];
  type: SafetyAlertType;
  severity: SafetyAlertSeverity;
  title: string;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  radius?: number; // affected radius in meters
  images?: string[];
  verifiedByAuthority: boolean;
  authoritySource?: string; // e.g., "Local Police Department"
  incidentTime?: Date;
  status: 'active' | 'resolved' | 'expired';
  updates?: ISafetyAlertUpdate[];
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface ISafetyAlertUpdate {
  id: string;
  alertId: string;
  authorId: string;
  content: string;
  timestamp: Date;
}

export interface ICreateSafetyAlertDto {
  type: SafetyAlertType;
  severity: SafetyAlertSeverity;
  title: string;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  radius?: number;
  images?: string[];
  incidentTime?: Date;
}

export interface IUpdateSafetyAlertDto {
  title?: string;
  description?: string;
  status?: 'active' | 'resolved' | 'expired';
  severity?: SafetyAlertSeverity;
}
