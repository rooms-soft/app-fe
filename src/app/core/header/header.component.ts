import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    Button,
    RouterLink,
  ],
  templateUrl: 'header.component.html',
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
}
