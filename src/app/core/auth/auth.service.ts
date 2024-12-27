import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { UserModel } from '@shared/types/user.model';
import { CreateUserPayload } from '@shared/types/create-user.payload';
import { LoginUserPayload } from '@shared/types/login-user.payload';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly loggedUser = signal<UserModel | null>(null);

  private readonly tokenKey = 'auth_token';
  private readonly http = inject(HttpClient);

  constructor() {
    const token = this.getToken();
    if (token) {
      this.getMe().subscribe();
    }
  }

  get BASE_URL() {
    return `${environment.API_BASE}/auth`;
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  login(credentials: LoginUserPayload) {
    return this.http.post<{ token: string }>(`${this.BASE_URL}/login`, credentials)
      .pipe(
        tap(({ token }) => this.setToken(token)),
        switchMap(() => this.getMe()),
      );
  }

  register(user: CreateUserPayload) {
    return this.http.post<{ token: string, user: UserModel }>(`${this.BASE_URL}/register`, user)
      .pipe(
        tap((userResponse) => {
          this.setToken(userResponse.token);
          this.loggedUser.set(userResponse.user);
        }),
      );
  }

  getMe() {
    return this.http.get<UserModel>(`${this.BASE_URL}/me`).pipe(tap((user) => this.loggedUser.set(user)));
  }

  logout() {
    this.clearToken();
    this.loggedUser.set(null);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private clearToken() {
    localStorage.removeItem(this.tokenKey);
  }
}
