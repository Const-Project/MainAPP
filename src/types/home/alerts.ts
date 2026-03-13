export interface GuestbookEntry {
  author: string;
  content: string;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  content: string;
  url: string | null;
  thumbnailUrl: string | null;
  isRead: boolean;
  notificationType: string;
  createdAt: string;
}
