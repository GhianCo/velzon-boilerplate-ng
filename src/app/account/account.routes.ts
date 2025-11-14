import {Routes} from '@angular/router';

import {LoginComponent} from "@app/account/login/login.component";
import {LoginResolver} from "@app/account/login/login.resolver";

export default [
  {
    path: "login",
    component: LoginComponent,
    resolve: {
      data: LoginResolver,
    },
  }
] as Routes;
