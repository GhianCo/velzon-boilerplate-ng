import {LayoutComponent} from './layouts/layout.component';

import {AuthGuard} from './core/guards/auth.guard';
import {Route} from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('app/pages/pages.routes'),
    canActivate: [AuthGuard]
  },
  {path: 'auth', loadChildren: () => import('app/account/account.routes')},
  {
    path: 'pages',
    loadChildren: () => import('./extraspages/extraspages.routes'),
    canActivate: [AuthGuard]
  },
  {path: 'landing', loadChildren: () => import('./landing/landing.routes')}
];
