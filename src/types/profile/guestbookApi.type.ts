export type GuestbookEntry = {
  author: string;
  content: string;
  createdAt: string;
};

export type CreateGuestbookRequest = {
  content: string;
};

export type CreateGuestbookResponse = Record<string, never>;
