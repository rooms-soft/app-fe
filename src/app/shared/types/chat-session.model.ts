import { UserModel } from '@shared/types/user.model';
import { ChatModel } from '@shared/types/chat.model';

export interface ChatSessionModel {
  id: string;
  user: UserModel;
  chat: ChatModel;
  connectedAt: string;
}
