import {Routes} from '@angular/router';

import {KanbanComponent} from "./kanban/kanban.component";
import {ListViewComponent} from "./list-view/list-view.component";
import {DetailsComponent} from "./details/details.component";

export default [
  {
    path: "kanban",
    component: KanbanComponent
  },
  {
    path: "list-view",
    component: ListViewComponent
  },
  {
    path: "details",
    component: DetailsComponent
  }
] as Routes;
