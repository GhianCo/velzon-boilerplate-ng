import {Routes} from '@angular/router';
import {ListComponent} from "./list/list.component";
import {OverviewComponent} from "./overview/overview.component";
import {CreateComponent} from "./create/create.component";

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
