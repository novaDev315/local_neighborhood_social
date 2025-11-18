import { MarketplaceCategory, MarketplaceItemStatus } from '../enums';

export interface IMarketplaceItem {
  id: string;
  sellerId: string;
  seller?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
  };
  neighborhoodId: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  price: number;
  isFree: boolean;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  images: string[];
  location: {
    latitude: number;
    longitude: number;
    displayAddress?: string; // fuzzy address for privacy
  };
  status: MarketplaceItemStatus;
  views: number;
  savedCount: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface IMarketplaceInquiry {
  id: string;
  itemId: string;
  buyerId: string;
  buyer?: {
    id: string;
    name: string;
    avatar?: string;
  };
  sellerId: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMarketplaceItemDto {
  title: string;
  description: string;
  category: MarketplaceCategory;
  price: number;
  isFree?: boolean;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  images: string[];
  tags?: string[];
}

export interface IUpdateMarketplaceItemDto {
  title?: string;
  description?: string;
  category?: MarketplaceCategory;
  price?: number;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  images?: string[];
  status?: MarketplaceItemStatus;
  tags?: string[];
}
