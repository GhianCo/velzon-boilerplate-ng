import {Routes} from '@angular/router';
import {StatisticsComponent} from "./statistics/statistics.component";
import {ApplicationComponent} from "./application/application.component";
import {NewjobComponent} from "./newjob/newjob.component";
import {CompaniesListComponent} from "./companies-list/companies-list.component";
import {JobCategoriesComponent} from "./job-categories/job-categories.component";

export default [
  {
    path: "statistics",
    component: StatisticsComponent
  },
  {
    path: "application",
    component: ApplicationComponent
  },
  {
    path: "newjob",
    component: NewjobComponent
  },
  {
    path: "companies-list",
    component: CompaniesListComponent
  },
  {
    path: "job-categories",
    component: JobCategoriesComponent
  },
  {
    path: 'job-lists', loadChildren: () => import('./job-lists/jos.lists.routes')
  },
  {
    path: 'candidate-lists', loadChildren: () => import('./candidate-lists/candidate.lists.routes')
  },
] as Routes;
