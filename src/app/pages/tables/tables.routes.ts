import {Routes} from '@angular/router';
import {BasicComponent} from "@app/pages/tables/basic/basic.component";
import {GridjsComponent} from "@app/pages/tables/gridjs/gridjs.component";
import {ListjsComponent} from "@app/pages/tables/listjs/listjs.component";

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
