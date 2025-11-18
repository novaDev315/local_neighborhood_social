import { BusinessCategory } from '../enums';

export interface IBusiness {
  id: string;
  ownerId: string;
  owner?: {
    id: string;
    name: string;
    avatar?: string;
  };
  name: string;
  description: string;
  category: BusinessCategory;
  subcategories?: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours?: IBusinessHours[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  logo?: string;
  coverImage?: string;
  images?: string[];
  amenities?: string[];
  specialOffers?: ISpecialOffer[];
  neighborhoodIds: string[];
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBusinessHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string; // HH:mm format
  close: string; // HH:mm format
  closed: boolean;
}

export interface ISpecialOffer {
  id: string;
  title: string;
  description: string;
  discountPercent?: number;
  validFrom: Date;
  validUntil: Date;
  terms?: string;
}

export interface IBusinessReview {
  id: string;
  businessId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  helpful: number;
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateBusinessDto {
  name: string;
  description: string;
  category: BusinessCategory;
  subcategories?: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours?: IBusinessHours[];
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  logo?: string;
  coverImage?: string;
}

export interface IUpdateBusinessDto {
  name?: string;
  description?: string;
  category?: BusinessCategory;
  subcategories?: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours?: IBusinessHours[];
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  logo?: string;
  coverImage?: string;
  amenities?: string[];
}
