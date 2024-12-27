import { UserModel } from '@shared/types/user.model';
import { ChatSessionModel } from '@shared/types/chat-session.model';

export interface ChatModel {
  id: string;
  name: string;
  owner: UserModel;
  createdAt: string;
  updatedAt: string;
  connectedUsers: ChatSessionModel[];
}
