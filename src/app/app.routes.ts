import {LayoutComponent} from '@velzon/layouts/layout.component';

import {Route} from "@angular/router";

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'inventario-efectivo' },
  {
    path: '',
    component: LayoutComponent,
    children:[
      { path: "inventario-efectivo", loadChildren: () => import('@app/inventario-efectivo/feature/inventario-efectivo-shell/inventario.efectivo.route') },
    ]
  },
  {path: 'auth', loadChildren: () => import('app/account/account.routes')},
  {path: 'landing', loadChildren: () => import('@velzon/landing/landing.routes')}
];
