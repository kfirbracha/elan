import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then((m) => m.HomeComponent) },
  { path: 'contact', loadComponent: () => import('./contact/contact').then((m) => m.ContactComponent) },
  { path: '**', redirectTo: '' },
];
