import {Routes} from '@angular/router';
import {DashboardComponent} from "@app/pages/dashboards/dashboard/dashboard.component";

export default [
  {
    path: "",
    component: DashboardComponent
  },
  {
    path: '', loadChildren: () => import('./dashboards/dashboards.routes')
  },
  {
    path: 'apps', loadChildren: () => import('./apps/apps.routes')
  },
  {
    path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.routes')
  },
  {
    path: 'projects', loadChildren: () => import('./projects/projects.routes')
  },
  {
    path: 'tasks', loadChildren: () => import('./tasks/tasks.routes')
  },
  {
    path: 'crm', loadChildren: () => import('./crm/crm.routes')
  },
  {
    path: 'crypto', loadChildren: () => import('./crypto/crypto.routes')
  },
  {
    path: 'invoices', loadChildren: () => import('./invoices/invoices.routes')
  },
  {
    path: 'tickets', loadChildren: () => import('./tickets/tickets.routes')
  },
  {
    path: 'pages', loadChildren: () => import('./extrapages/extrapages.routes')
  },
  {
    path: 'ui', loadChildren: () => import('./ui/ui.routes')
  },
  {
    path: 'advance-ui', loadChildren: () => import('./advance-ui/advance.ui.routes')
  },
  {
    path: 'forms', loadChildren: () => import('./form/form.routes')
  },
  {
    path: 'tables', loadChildren: () => import('./tables/tables.routes')
  },
  {
    path: 'charts', loadChildren: () => import('./charts/charts.routes')
  },
  {
    path: 'icons', loadChildren: () => import('./icons/icons.routes')
  },
  {
    path: 'maps', loadChildren: () => import('./maps/maps.routes')
  },
  {
    path: 'marletplace',
    loadChildren: () => import('./nft-marketplace/nft.marketplace.routes')
  },
] as Routes;
