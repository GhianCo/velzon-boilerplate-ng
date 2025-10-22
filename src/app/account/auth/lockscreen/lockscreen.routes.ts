import {Routes} from '@angular/router';
import {BasicComponent} from "@app/account/auth/lockscreen/basic/basic.component";
import {CoverComponent} from "@app/account/auth/lockscreen/cover/cover.component";

export default [
  {
    path: "basic",
    component: BasicComponent
  },
  {
    path: "cover",
    component: CoverComponent
  }
] as Routes;
