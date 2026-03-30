import {LayoutComponent} from '@velzon/layouts/layout.component';

import {Route} from "@angular/router";
import {NoAuthGuard} from "@shared/guards/noAuth.guard";
import {AuthGuard} from "@shared/guards/auth.guard";
import {RoleGuard} from "@shared/guards/role.guard";
import {NoAccessComponent} from "@shared/components/no-access/no-access.component";

export const appRoutes: Route[] = [
  {path: '', pathMatch: 'full', redirectTo: 'inventario-efectivo'},
  {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'inventario-efectivo'},
  {path: 'no-access', component: NoAccessComponent},
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: "inventario-efectivo",
        canActivate: [RoleGuard],
        data: { roles: ['turno.module'] },
        loadChildren: () => import('@app/inventario-efectivo/feature/inventario-efectivo-shell/inventario.efectivo.route')
      },
      {
        path: "inventario-caja",
        canActivate: [RoleGuard],
        data: { roles: ['caja.module'] },
        loadChildren: () => import('@app/inventario-caja/feature/inventario-caja-shell/inventario.caja.route')
      },
      {
        path: "cuadre-suma-diaria",
        canActivate: [RoleGuard],
        data: { roles: ['turno.module'] },
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
