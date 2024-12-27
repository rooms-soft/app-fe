import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('@pages/home/home.component').then(m => m.HomeComponent) },
  {
    path: 'chat',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'room/:chatId',
        loadComponent: () => import('@pages/chat/chat-room/chat-room.component').then(m => m.ChatRoomComponent),
      },
      {
        path: 'list',
        loadComponent: () => import('@pages/chat/chat-list/chat-list.component').then(m => m.ChatListComponent),
      },
    ],
  },
  { path: 'login', loadComponent: () => import('@core/auth/pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('@core/auth/pages/register/register.component').then(m => m.RegisterComponent) },
];
