import {LayoutComponent} from '@velzon/layouts/layout.component';

import {Route} from "@angular/router";
import {NoAuthGuard} from "@shared/guards/noAuth.guard";
import {AuthGuard} from "@shared/guards/auth.guard";

export const appRoutes: Route[] = [
  {path: '', pathMatch: 'full', redirectTo: 'inventario-efectivo'},
  {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'inventario-efectivo'},
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: "inventario-efectivo",
        loadChildren: () => import('@app/inventario-efectivo/feature/inventario-efectivo-shell/inventario.efectivo.route')
      },
      {
        path: "cuadre-suma-diaria",
        loadChildren: () => import('@app/control-interno/cuadre-suma-diaria/feature/cuadre-suma-diaria-shell/cuadre.suma.diaria.route')
      },
    ]
  },
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    loadChildren: () => import('app/account/account.routes')
  },
  {
    path: 'landing',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    loadChildren: () => import('@velzon/landing/landing.routes')
  }
];
