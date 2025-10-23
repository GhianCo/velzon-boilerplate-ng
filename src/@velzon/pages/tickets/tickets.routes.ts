import {Routes} from '@angular/router';

import {ListComponent} from "./list/list.component";
import {DetailsComponent} from "./details/details.component";

export default [
  {
    path: "list",
    component: ListComponent
  },
  {
    path: "details",
    component: DetailsComponent
  }
] as Routes;
