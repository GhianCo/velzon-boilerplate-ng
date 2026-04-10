import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import {AuthService} from "@sothy/services/auth.service";
import {AuthUtils} from "@sothy/services/auth.utils";

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    // Definir rutas que deben OMITIR el token de autenticación
    const excludedDomains = ['api.maptiler.com'];

    const isExcluded = excludedDomains.some(domain => req.url.includes(domain));

    if (isExcluded) {
        return next(req);
    }

    // Clone the request object
    let newReq = req.clone();

    // AuthUtils.isTokenExpired puede lanzar con tokens de Keycloak;
    // en ese caso asumimos que el token es válido (el backend lo rechazará si no).
    let tokenValid = false;
    try {
        tokenValid = !!authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken);
    } catch {
        tokenValid = !!authService.accessToken;
    }

    if (tokenValid) {
        newReq = req.clone({
            headers: req.headers.set(
                'Authorization',
                'Bearer ' + authService.accessToken
            ),
        });
    }

    // Response
    return next(newReq).pipe(
        catchError((error) => {
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Sign out
                authService.signOut();

                // Reload the app
                location.reload();
            }

            return throwError(error);
        })
    );
};
