import {Routes} from '@angular/router';
import {BasicComponent} from "@app/account/auth/errors/basic/basic.component";
import {CoverComponent} from "@app/account/auth/errors/cover/cover.component";
import {AltComponent} from "@app/account/auth/errors/alt/alt.component";
import {Page500Component} from "@app/account/auth/errors/page500/page500.component";
import {OfflineComponent} from "@app/account/auth/errors/offline/offline.component";

export default [
  {
    path:"404-basic",
    component: BasicComponent
  },
  {
    path: "404-cover",
    component: CoverComponent
  },
  {
    path: "404-alt",
    component: AltComponent
  },
  {
    path: "page-500",
    component: Page500Component
  },
  {
    path: "offline",
    component: OfflineComponent
  }
] as Routes;
