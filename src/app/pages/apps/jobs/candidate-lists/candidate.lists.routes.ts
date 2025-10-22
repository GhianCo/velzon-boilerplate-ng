import {Routes} from '@angular/router';
import {ListViewComponent} from "@app/pages/apps/jobs/candidate-lists/list-view/list-view.component";
import {GridViewComponent} from "@app/pages/apps/jobs/candidate-lists/grid-view/grid-view.component";

export default [
  {
    path: "listview",
    component: ListViewComponent
  },
  {
    path: "gridview",
    component: GridViewComponent
  },
] as Routes;
