import {inject} from '@angular/core';
import {CanActivateChildFn, CanActivateFn} from '@angular/router';
import {KeycloakService} from '@app/account/services/keycloak.service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = async () => {
    const keycloak = inject(KeycloakService);

    // Token válido y sesión activa → permitir acceso
    if (keycloak.authenticated) {
        // Refrescar proactivamente si expira en menos de 30 s
        await keycloak.updateToken(30);
        return true;
    }

    // Sin sesión → redirigir a Keycloak (nunca debería ocurrir con login-required,
    // pero cubre casos de pérdida de sesión en caliente)
    await keycloak.login(window.location.href);
    return false;
};
