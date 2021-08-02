export interface CommentMessage {
  id: string; // ---Message ID
  userId: string; // ---The identifier of the user who create the Message
  contextType: 'POI' | 'HIKE' | 'COORD'; // ---The type of the object where this Message belongs to
  contextId: string; // ---The id of the object where this Message belongs to
  createdDate: Date; // ---The time when this Message was created
  title?: string; // ---Message title (optional)
  body: string; // ---The content of the message to be displayed in the UI
  language?: string; // ---Language of this Message

  longitude?: number; // ---GPS longitude position of the Message (optional)
  latitude?: number; // ---GPS latitude position of the Message (optional)

  private?: boolean; // ---Is this Message private or not. Default: false
  hidden?: boolean; // ---True if the message hidden on the UI. Default: false
}
