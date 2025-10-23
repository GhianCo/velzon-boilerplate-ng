import {Routes} from '@angular/router';
import {ListViewComponent} from "./list-view/list-view.component";
import {GridViewComponent} from "./grid-view/grid-view.component";

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
