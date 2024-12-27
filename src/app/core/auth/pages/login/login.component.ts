import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { first, of } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastService } from '@shared/services/toast.service';
import { AuthService } from '../../auth.service';

@UntilDestroy()
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
  ],
  templateUrl: 'login.component.html',
})
export class LoginComponent {
  readonly formBuilder = inject(NonNullableFormBuilder);
  readonly loginForm = this.formBuilder.group({
    username: this.formBuilder.control('', [Validators.required]),
    password: this.formBuilder.control('', [Validators.required]),
  });

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  constructor() {
    toObservable(this.authService.loggedUser)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        tap(() => this.router.navigate(['/'])),
      )
      .subscribe();
  }

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      this.authService.login(credentials)
        .pipe(
          first(),
          catchError(() => {
            this.toastService.show('error', 'An error occurred', 'error');
            return of(false);
          }),
          filter(Boolean),
          tap(() => {
            this.toastService.show('success', 'Logged in :)', 'info');
            this.router.navigate(['/']);
          }),
        )
        .subscribe();
    }
  }
}
