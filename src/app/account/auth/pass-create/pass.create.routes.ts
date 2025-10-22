import {Routes} from '@angular/router';
import {BasicComponent} from "@app/account/auth/pass-create/basic/basic.component";
import {CoverComponent} from "@app/account/auth/pass-create/cover/cover.component";

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
