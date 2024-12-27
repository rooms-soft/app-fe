import { inject, Injectable, signal } from '@angular/core';
import { catchError, filter, first, from, of, tap } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { ChatService } from '@shared/services/chat.service';
import { ChatSessionModel } from '@shared/types/chat-session.model';
import { SdpEventTypeEnum } from '@shared/types/sdp-event-type.enum';
import { ChatSignalEventEnum } from '@shared/types/chat-signal-event.enum';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  session: ChatSessionModel | null = null;

  readonly localStream = signal<MediaStream | null>(null);
  readonly remoteStream = signal<MediaStream>(new MediaStream());
  peerConnection = new RTCPeerConnection(this.STUN_SERVERS);

  private readonly toastService = inject(ToastService);
  private readonly chatService = inject(ChatService);

  constructor() {
    this.subscribeChatSignalEvents();
  }

  get STUN_SERVERS() {
    return environment.STUN_SERVERS;
  }

  getPermission(): void {
    from(navigator.mediaDevices.getUserMedia({ audio: true, video: true }))
      .pipe(
        first(),
        catchError(() => {
          this.toastService.show('error', 'Error', 'Failed to get permission');
          return of(null);
        }),
        filter(Boolean),
        tap((stream) => this.localStream.set(stream)),
      )
      .subscribe();
  }


  async getOffer(senderId: string) {
    this.initPeerConnection(senderId);

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    return offer;
  }

  async getAnswer(offerSDP: RTCSessionDescriptionInit, senderId: string) {
    this.initPeerConnection(senderId);

    await this.peerConnection.setRemoteDescription(offerSDP);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    return answer;
  }

  private initPeerConnection(senderId: string) {
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream()?.addTrack(track);
      });
    };

    this.localStream()
      ?.getTracks()
      .forEach((track) => this.peerConnection.addTrack(track, this.localStream() as MediaStream));

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.chatService.chatSocket.emit(ChatSignalEventEnum.SDP_EVENT, {
          sdp: JSON.stringify(event.candidate),
          type: SdpEventTypeEnum.ice,
          senderId: this.session?.id,
          recipientId: senderId,
        });
      }
    };
  }

  private acceptAnswer(answer: RTCSessionDescriptionInit) {
    from(this.peerConnection.setRemoteDescription(answer)).subscribe();
  }

  private subscribeChatSignalEvents() {
    this.chatService.chatSocket.on(ChatSignalEventEnum.JOIN_SUCCESS, (session) => this.session = session);

    this.chatService.chatSocket.on(ChatSignalEventEnum.LEAVE_EVENT, async (data) => {
      this.toastService.show('success', 'Info', data.message);
      this.peerConnection = new RTCPeerConnection(this.STUN_SERVERS);
    });

    this.chatService.chatSocket.on(ChatSignalEventEnum.CONNECTION_EVENT, async (data) => {
      this.toastService.show('success', 'Info', data.message);
      this.peerConnection = new RTCPeerConnection(this.STUN_SERVERS);
      const offer = await this.getOffer(data.sessionId);

      this.chatService.chatSocket.emit(ChatSignalEventEnum.SDP_EVENT, {
        sdp: JSON.stringify(offer),
        type: SdpEventTypeEnum.offer,
        senderId: this.session?.id,
        recipientId: data.sessionId,
      });
    });

    this.chatService.chatSocket.on(ChatSignalEventEnum.SDP_EVENT, async (data: { senderId: string; type: string, sdp: string }) => {
      if (data.type === SdpEventTypeEnum.offer) {
        const answer = await this.getAnswer(JSON.parse(data.sdp), data.senderId);

        this.chatService.chatSocket.emit(ChatSignalEventEnum.SDP_EVENT, {
          sdp: JSON.stringify(answer),
          type: SdpEventTypeEnum.answer,
          senderId: this.session?.id,
          recipientId: data.senderId,
        });
      } else if (data.type === SdpEventTypeEnum.ice) {
        await this.peerConnection.addIceCandidate(JSON.parse(data.sdp));
      } else {
        this.acceptAnswer(JSON.parse(data.sdp));
      }
    });
  }
}
