import {Routes} from '@angular/router';

import {ListComponent} from "@app/pages/tickets/list/list.component";
import {DetailsComponent} from "@app/pages/tickets/details/details.component";
import {CreateComponent} from "@app/pages/invoices/create/create.component";

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
