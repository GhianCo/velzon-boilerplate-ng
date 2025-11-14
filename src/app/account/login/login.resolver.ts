import {inject} from '@angular/core';
import {AuthLoginStore} from "@app/account/data-access/auth.login.store";

export const LoginResolver = () => {
  const authLoginStore = inject(AuthLoginStore);
  return authLoginStore.loadSalas()
}
