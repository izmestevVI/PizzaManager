import { Routes } from '@angular/router';


export const MENU_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./menu').then(m => m.Menu) },
  { path: 'new', loadComponent: () => import('./pizza/pizza').then(m => m.PizzaComponent) },
  { path: ':id', loadComponent: () => import('./pizza/pizza').then(m => m.PizzaComponent) }
];