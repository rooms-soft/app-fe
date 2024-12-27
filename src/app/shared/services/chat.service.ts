import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client';
import { environment } from '@env/environment';
import { ChatModel } from '@shared/types/chat.model';
import { CreateChatPayload } from '@shared/types/create-chat.payload';
import { catchError, filter, of, tap } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  readonly chatSocket = io(this.API_BASE, {
    transports: ['websocket'],
  });

  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  constructor() {}

  get API_BASE() {
    return `${environment.API_BASE}/chat`;
  }

  joinChat(chatId: string) {
    this.authService.getMe()
      .pipe(
        filter(Boolean),
        tap(() => this.chatSocket.emit('join-chat', { userId: this.authService.loggedUser()?.id, chatId })),
      )
      .subscribe();
  }

  leaveChat(chatId: string) {
    this.chatSocket.emit('leave-chat', { chatId });
  }

  createChat(chatPayload: CreateChatPayload) {
    return this.http.post<ChatModel>(`${this.API_BASE}`, chatPayload)
      .pipe(
        catchError(() => {
          this.toastService.show('error', 'Error', 'Failed to create chat');
          return of(null);
        }),
      );
  }

  getAllChats() {
    return this.http.get<ChatModel[]>(`${this.API_BASE}`);
  }
}
