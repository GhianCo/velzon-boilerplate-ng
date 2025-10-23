import {Routes} from '@angular/router';
import {BasicComponent} from "./basic/basic.component";
import {GridjsComponent} from "./gridjs/gridjs.component";
import {ListjsComponent} from "./listjs/listjs.component";

export default [
  {
    path: "basic",
    component: BasicComponent
  },
  {
    path: "gridjs",
    component: GridjsComponent
  },
  {
    path: "listjs",
    component: ListjsComponent
  }
] as Routes;
