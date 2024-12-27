import { Component, inject } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ChatService } from '@shared/services/chat.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { first, tap } from 'rxjs';
import { AsyncPipe, NgForOf } from '@angular/common';
import { ChatModel } from '@shared/types/chat.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  templateUrl: './chat-list.component.html',
  imports: [
    Dialog,
    InputText,
    Button,
    ReactiveFormsModule,
    AsyncPipe,
    NgForOf,
  ],
})
export class ChatListComponent {
  visible = false;
  chatService = inject(ChatService);
  chats$ = this.chatService.getAllChats().pipe(first());

  readonly formBuilder = inject(NonNullableFormBuilder);
  readonly createChatForm = this.formBuilder.group({
    name: this.formBuilder.control('', Validators.required),
  });

  private readonly router = inject(Router);

  showDialog() {
    this.visible = true;
  }

  onSaveChat() {
    this.visible = false;

    if (this.createChatForm.valid) {
      this.chatService.createChat(this.createChatForm.getRawValue())
        .pipe(
          first(),
          tap(() => this.chats$ = this.chatService.getAllChats().pipe(first())),
        )
        .subscribe();
    }
  }

  joinChat(chatId: string) {
    this.router.navigate(['/chat/room', chatId]);
  }

  trackByChatId(index: number, chat: ChatModel) {
    return chat.id;
  }
}
