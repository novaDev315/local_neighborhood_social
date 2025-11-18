import { UserRole, VerificationStatus } from '../enums';

export interface IUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  addressVerified: boolean;
  verificationStatus: VerificationStatus;
  location?: {
    latitude: number;
    longitude: number;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  neighborhoodId?: string;
  skills?: string[];
  interests?: string[];
  privacySettings: IPrivacySettings;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
}

export interface IPrivacySettings {
  showExactAddress: boolean;
  showPhone: boolean;
  showEmail: boolean;
  allowMessages: boolean;
  allowGroupInvites: boolean;
  visibleToNeighborsOnly: boolean;
}

export interface IUserProfile extends Omit<IUser, 'email' | 'phone'> {
  connectionStatus?: 'connected' | 'pending' | 'none';
  distance?: number;
}

export interface ICreateUserDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface IUpdateUserDto {
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  privacySettings?: Partial<IPrivacySettings>;
}
