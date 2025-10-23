import {Routes} from '@angular/router';

import {ListComponent} from "../tickets/list/list.component";
import {DetailsComponent} from "../tickets/details/details.component";
import {CreateComponent} from "./create/create.component";

export default [
  {
    path: "list",
    component: ListComponent
  },
  {
    path: "details",
    component: DetailsComponent
  },
  {
    path: "create",
    component: CreateComponent
  }
] as Routes;
