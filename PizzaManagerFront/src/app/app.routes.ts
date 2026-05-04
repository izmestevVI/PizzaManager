import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', 
                redirectTo: 'dashboard', 
                pathMatch: 'full' 
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'menu',
                loadChildren: () => import('./features/menu/menu.routes').then(m => m.MENU_ROUTES)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/orders/orders').then(m => m.Orders)
            },
        ]
    }
];
