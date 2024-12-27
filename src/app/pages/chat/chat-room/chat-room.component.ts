import { Component, HostListener, inject, OnInit } from '@angular/core';
import { StreamService } from '@shared/services/stream.service';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { first, tap } from 'rxjs';
import { ChatService } from '@shared/services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  templateUrl: './chat-room.component.html',
  imports: [
    CommonModule,
    Button,
  ],
})
export class ChatRoomComponent implements OnInit {
  isMediaDenied = false;
  chatId!: string;

  readonly streamService = inject(StreamService);
  readonly chatService = inject(ChatService);
  readonly router = inject(Router);
  readonly activeRoute = inject(ActivatedRoute);

  get localVideoEnabled() {
    return this.streamService.localStream()?.getVideoTracks()
      .some((track) => track.enabled);
  }

  get localAudioEnabled() {
    return this.streamService.localStream()?.getAudioTracks()
      .some((track) => track.enabled);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this.streamService.peerConnection.close();
    this.chatService.leaveChat(this.chatId);
  }

  ngOnInit() {
    this.streamService.getPermission();

    this.activeRoute.params
      .pipe(
        first(),
        tap(({ chatId }) => {
          this.chatId = chatId;
          this.chatService.joinChat(chatId);
        }),
      )
      .subscribe();
  }

  toggleVideo() {
    this.streamService.localStream()?.getVideoTracks()
      .forEach(track => track.enabled = !track.enabled);
  }

  toggleAudio() {
    this.streamService.localStream()?.getAudioTracks()
      .forEach(track => track.enabled = !track.enabled);
  }
}
