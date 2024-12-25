import { Component, inject, OnInit } from '@angular/core';
import { StreamService } from '@shared/services/stream.service';
import { CommonModule } from '@angular/common';
import { MediaSourceStatus } from '@shared/types/media-source-status';
import { Button } from 'primeng/button';
import { combineLatest } from 'rxjs';

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

  readonly streamService = inject(StreamService);

  get localVideoEnabled() {
    return this.streamService.localStream()?.getVideoTracks()
      .some((track) => track.enabled);
  }

  get localAudioEnabled() {
    return this.streamService.localStream()?.getAudioTracks()
      .some((track) => track.enabled);
  }

  ngOnInit() {
    this.streamService.getPermission();

    combineLatest([
      this.streamService.cameraPermission$,
      this.streamService.microphonePermission$,
    ]).subscribe(([cameraStatus, microphoneStatus]) => {
      if (cameraStatus === MediaSourceStatus.granted || microphoneStatus === MediaSourceStatus.granted) {
        this.streamService.getPermission();
      }

      this.isMediaDenied = cameraStatus === MediaSourceStatus.denied || microphoneStatus === MediaSourceStatus.denied;
    });
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
