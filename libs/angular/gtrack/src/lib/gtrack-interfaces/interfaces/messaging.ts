import { EAuthRoles } from '@gtrack/shared/authentication/data-access';

export enum EMessageContentType {
  text = 'text',
  url = 'url',
  image = 'image',
  translateable = 'translateable',
  any = 'any',
  title = 'title',
}

export interface MessageContentType {
  type: EMessageContentType;
  content: unknown;
}

export enum EMessageState {
  unread = 'unread',
  read = 'read',
  archived = 'archived',
}

export enum EMessagePrivacy {
  private = 'private',
  public = 'public',
  followers = 'followers',
  featured = 'featured',
}

export interface Message {
  userId: string;
  message: MessageContentType[];
  context: string;
  likes?: unknown[];
  state?: EMessageState;
  privacy?: EMessagePrivacy;
  shareCount?: number;
}

export type MessageSent = Message;

export interface MessageStored extends MessageSent {
  timestamp: number;
  id: string;
  likes?: {
    userId: string;
    role: EAuthRoles;
  }[];
  isModerated?: boolean;
}

export interface MessageStateChange {
  desiredState?: EMessageState;
  desiredPrivacy?: EMessagePrivacy;
  messageId: string;
}

export interface MessageLike {
  messageId: string;
  like: boolean;
}

export type MessageLikeInput = MessageLike;

export interface MessageThread {
  partnerId: string;
  partnerRole: EAuthRoles;
  lastMessageContent: unknown;
  lastMessageTimestamp: number;
  lastMessageState?: EMessageState;
  lastMessageRole: EAuthRoles;
  lastMessageUserId: string;
}

export interface MessageDelete {
  messageId: string;
  context: string;
}

export interface MessageFeatured {
  messageId: string;
  isFeatured: boolean;
}

export interface MessageModerate {
  messageId: string;
  isBanned: boolean;
  reason?: string;
}
