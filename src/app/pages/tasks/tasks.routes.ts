import {Routes} from '@angular/router';

import {KanbanComponent} from "@app/pages/tasks/kanban/kanban.component";
import {ListViewComponent} from "@app/pages/tasks/list-view/list-view.component";
import {DetailsComponent} from "@app/pages/tasks/details/details.component";

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
