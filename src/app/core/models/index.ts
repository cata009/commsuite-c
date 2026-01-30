export interface Message {
    id: string;
    companies: string[];
    sender: string;
    subject: string;
    time: string;
    timestamp: string;
    hasAttachment: boolean;
    unreadCount: number;
    isEntered: boolean;
    isTodo: boolean;
    folder: 'Inbox' | 'Drafts' | 'Deleted Items';
}

export interface Announcement {
    id: string;
    companies: string[];
    title: string;
    preview: string;
    publishedDate: string;
    updatedDate: string;
    hasAttachment: boolean;
    hasTodo: boolean;
    status: 'informative' | 'important' | 'recalled';
    isRead: boolean;
    content: string;
    expirationDate?: string;
    folder: 'Inbox' | 'Deleted';
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    size: string;
    category: 'document' | 'image';
    url?: string;
}

export interface ConversationMessage {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    isOwn: boolean;
    isTodo?: boolean;
    isRead?: boolean;
    replyTo?: ConversationMessage;
    isReplyExpanded?: boolean;
    attachments?: Attachment[];
}

export type SystemMessageType =
    | 'member_added'
    | 'member_removed'
    | 'you_were_added'
    | 'you_were_removed'
    | 'member_left_org'
    | 'you_left_org'
    | 'banker_replaced'
    | 'forward_separator';

export interface SystemMessage {
    id: string;
    type: SystemMessageType;
    timestamp: string;
    actor?: string;
    targetUser: string;
    organization?: string;
    replacementUser?: string;
}

export type ConversationItem = ConversationMessage | SystemMessage;

export function isSystemMessage(item: ConversationItem): item is SystemMessage {
    return 'type' in item && !('content' in item);
}

export interface ConversationData {
    title: string;
    lastUpdated: string;
    participants: number;
    participantsList: string[];
    messages: ConversationItem[];
    isUserRemoved?: boolean;
    unreadCount?: number;
}

export interface FilterOptions {
    companies: string[];
    members: string[];
    dateRange: { from: Date | undefined; to: Date | undefined };
    unread: boolean;
    todo: boolean;
    attachments: boolean;
}
