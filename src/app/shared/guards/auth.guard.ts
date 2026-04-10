import {inject} from '@angular/core';
import {CanActivateChildFn, CanActivateFn} from '@angular/router';
import {KeycloakService} from '@app/account/services/keycloak.service';
import {AuthService} from '@sothy/services/auth.service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = async () => {
    const keycloak = inject(KeycloakService);
    const authService = inject(AuthService);

    // Sesión Keycloak activa (flujo KC normal) → permitir acceso
    if (keycloak.authenticated) {
        await keycloak.updateToken(30);
        return true;
    }

    // Token externo (PHP ROPC) presente en storage → permitir acceso
    if (authService.accessToken) {
        return true;
    }

    // Sin sesión ni token: el usuario necesita autenticarse.
    // Si KC ya fue inicializado (flujo normal), el adaptador existe y podemos
    // llamar login() directamente. Si no fue inicializado (flujo externo donde
    // el token luego fue eliminado, p.ej. por un 401 del interceptor),
    // llamamos init() que ya tiene onLoad:'login-required' y redirige a KC.
    if (keycloak.isInitialized) {
        await keycloak.login(window.location.href);
    } else {
        await keycloak.init();
    }
    return false;
};
