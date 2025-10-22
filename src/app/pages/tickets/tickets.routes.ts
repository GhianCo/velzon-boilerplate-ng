import {Routes} from '@angular/router';

import {ListComponent} from "@app/pages/tickets/list/list.component";
import {DetailsComponent} from "@app/pages/tickets/details/details.component";

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
