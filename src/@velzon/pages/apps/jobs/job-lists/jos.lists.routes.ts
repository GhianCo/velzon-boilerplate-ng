import {Routes} from '@angular/router';
import {ListComponent} from "./list/list.component";
import {GridComponent} from "./grid/grid.component";
import {OverviewComponent} from "./overview/overview.component";

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
