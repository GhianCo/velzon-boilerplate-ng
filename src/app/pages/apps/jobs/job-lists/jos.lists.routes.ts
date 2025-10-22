import {Routes} from '@angular/router';
import {ListComponent} from "@app/pages/apps/jobs/job-lists/list/list.component";
import {GridComponent} from "@app/pages/apps/jobs/job-lists/grid/grid.component";
import {OverviewComponent} from "@app/pages/apps/jobs/job-lists/overview/overview.component";

export default [
  {
    path: "list",
    component: ListComponent
  },
  {
    path: "grid",
    component: GridComponent
  },
  {
    path: "overview",
    component: OverviewComponent
  },
] as Routes;
