import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('@pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'chat', loadComponent: () => import('@pages/chat/chat-room/chat-room.component').then(m => m.ChatRoomComponent) },
];
