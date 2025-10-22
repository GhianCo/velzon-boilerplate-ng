import {Routes} from '@angular/router';
import {ListComponent} from "@app/pages/projects/list/list.component";
import {OverviewComponent} from "@app/pages/projects/overview/overview.component";
import {CreateComponent} from "@app/pages/projects/create/create.component";

export default [
  {
    path: "list",
    component: ListComponent
  },
  {
    path: "overview",
    component: OverviewComponent
  },
  {
    path: "create",
    component: CreateComponent
  }
] as Routes;
