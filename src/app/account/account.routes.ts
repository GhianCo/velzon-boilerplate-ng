import {Routes} from '@angular/router';

import {RegisterComponent} from "@app/account/register/register.component";
import {LoginComponent} from "@app/account/login/login.component";

export default [
  {
    path: 'signin',
    loadChildren: () => import('./auth/signin/signin.routes')
  },
  {
    path: 'signup',
    loadChildren: () => import('./auth/signup/signup.routes')
  },
  {
    path: 'pass-reset',
    loadChildren: () => import('./auth/pass-reset/pass.reset.routes')
  },
  {
    path: 'pass-create',
    loadChildren: () => import('./auth/pass-create/pass.create.routes')
  },
  {
    path: 'lockscreen', loadChildren: () => import('./auth/lockscreen/lockscreen.routes')
  },
  {
    path: 'logout', loadChildren: () => import('./auth/logout/logout.routes')
  },
  {
    path: 'success-msg',
    loadChildren: () => import('./auth/success-msg/success.msg.routes')
  },
  {
    path: 'twostep', loadChildren: () => import('./auth/twostep/twostep.routes')
  },
  {
    path: 'errors', loadChildren: () => import('./auth/errors/errors.routes')
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "login",
    component: LoginComponent
  }
] as Routes;
