import { GroupPrivacy } from '../enums';

export interface IGroup {
  id: string;
  name: string;
  description: string;
  privacy: GroupPrivacy;
  neighborhoodId: string;
  creatorId: string;
  creator?: {
    id: string;
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  category: string;
  tags?: string[];
  memberCount: number;
  postCount: number;
  rules?: string[];
  settings: IGroupSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroupSettings {
  requireApproval: boolean;
  allowMemberPosts: boolean;
  allowMemberInvites: boolean;
  allowEvents: boolean;
  allowPolls: boolean;
}

export interface IGroupMember {
  id: string;
  groupId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  invitedBy?: string;
}

export interface IGroupInvitation {
  id: string;
  groupId: string;
  inviterId: string;
  inviteeId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: Date;
  respondedAt?: Date;
}

export interface ICreateGroupDto {
  name: string;
  description: string;
  privacy: GroupPrivacy;
  category: string;
  coverImage?: string;
  tags?: string[];
  rules?: string[];
  settings?: Partial<IGroupSettings>;
}

export interface IUpdateGroupDto {
  name?: string;
  description?: string;
  privacy?: GroupPrivacy;
  category?: string;
  coverImage?: string;
  tags?: string[];
  rules?: string[];
  settings?: Partial<IGroupSettings>;
}
