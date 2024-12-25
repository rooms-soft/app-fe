import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly messageService = inject(MessageService);

  show(severity: 'success' | 'error', summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}
