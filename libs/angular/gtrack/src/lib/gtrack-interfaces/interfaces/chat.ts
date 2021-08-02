export interface ChatMessage {
  userId: string;
  message: string;
}

export interface ChatMessageSent extends ChatMessage {
  room: string;
}

export interface ChatMessageStored extends ChatMessage {
  timestamp: number;
}
