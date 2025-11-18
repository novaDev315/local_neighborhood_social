import { PostCategory, PostVisibility } from '../enums';

export interface IPost {
  id: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    verificationBadge: boolean;
  };
  neighborhoodId: string;
  content: string;
  category: PostCategory;
  visibility: PostVisibility;
  media?: IMediaAttachment[];
  tags?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  reactions: IReactionCount;
  commentCount: number;
  isPinned: boolean;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMediaAttachment {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  metadata?: {
    width?: number;
    height?: number;
    size?: number;
    duration?: number;
  };
}

export interface IReactionCount {
  like: number;
  love: number;
  helpful: number;
  thanks: number;
  total: number;
}

export interface IComment {
  id: string;
  postId: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  parentId?: string; // for nested comments
  reactions: IReactionCount;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePostDto {
  content: string;
  category: PostCategory;
  visibility: PostVisibility;
  media?: IMediaAttachment[];
  tags?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface IUpdatePostDto {
  content?: string;
  category?: PostCategory;
  visibility?: PostVisibility;
  tags?: string[];
}
