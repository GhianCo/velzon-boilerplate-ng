import {Routes} from '@angular/router';
import {BasicComponent} from "@app/account/auth/twostep/basic/basic.component";
import {CoverComponent} from "@app/account/auth/twostep/cover/cover.component";

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
