import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, filter, first, from, Observable, of, tap } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { MediaSourceStatus } from '@shared/types/media-source-status';
import { MediaSourceType } from '@shared/types/media-source-type';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  readonly localStream = signal<MediaStream | null>(null);
  readonly remoteStream = signal<MediaStream | null>(null);
  readonly peerConnection = signal(new RTCPeerConnection());

  private readonly cameraPermissionSubject = new BehaviorSubject<MediaSourceStatus | null>(null);
  private readonly microphonePermissionSubject = new BehaviorSubject<MediaSourceStatus | null>(null);
  private readonly toastService = inject(ToastService);

  constructor() {
    this.initializePermissionListener(MediaSourceType.camera, this.cameraPermissionSubject);
    this.initializePermissionListener(MediaSourceType.microphone, this.cameraPermissionSubject);

    toObservable(this.localStream)
      .pipe(
        filter(Boolean),
        first(),
        tap(async () => {
          await this.sendOffer();
        }),
      )
      .subscribe();
  }

  get cameraPermission$(): Observable<MediaSourceStatus | null> {
    return this.cameraPermissionSubject.asObservable();
  }

  get microphonePermission$(): Observable<MediaSourceStatus | null> {
    return this.microphonePermissionSubject.asObservable();
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


  async sendOffer(): Promise<void> {
    this.remoteStream.set(new MediaStream());

    this.localStream()
      ?.getTracks()
      .forEach((track) => this.peerConnection().addTrack(track, this.localStream() as MediaStream));

    this.peerConnection().ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream()?.addTrack(track);
      });
    };

    const offer = await this.peerConnection().createOffer();
    await this.peerConnection().setLocalDescription(offer);

    await this.sendAnswer(offer);
  }

  async sendAnswer(offerSDP: RTCSessionDescriptionInit): Promise<void> {
    this.localStream()
      ?.getTracks()
      .forEach((track) => this.peerConnection().addTrack(track, this.localStream() as MediaStream));

    await this.peerConnection().setRemoteDescription(offerSDP);

    // TODO: to make it work, answer from another peer
    const answer = await this.peerConnection().createAnswer();
    await this.peerConnection().setLocalDescription(answer);

    this.initPeerConnection(answer);
  }

  initPeerConnection(answer: RTCSessionDescriptionInit): void {
    if (!this.peerConnection().currentRemoteDescription) {
      this.peerConnection().setRemoteDescription(answer);
    }
  }

  private async initializePermissionListener(
    permissionName: MediaSourceType,
    subject: BehaviorSubject<MediaSourceStatus | null>,
  ): Promise<void> {
    const permissionStatus = await navigator.permissions.query({ name: permissionName as unknown as PermissionName });

    subject.next(permissionStatus.state as MediaSourceStatus);

    permissionStatus.addEventListener('change', () => {
      subject.next(permissionStatus.state as MediaSourceStatus);
    });
  }
}
