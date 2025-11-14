import {inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {PersistenceService} from "@sothy/services/persistence.service";
import {PKEY} from "@shared/constants/persistence.const";
import {AuthUtils} from "@sothy/services/auth.utils";

@Injectable({providedIn: 'root'})
export class AuthService {

    persistence = inject(PersistenceService);

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        this.persistence.set(PKEY.TOKEN, token)
    }

    get accessToken(): string {
        return this.persistence.get(PKEY.TOKEN) ?? '';
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        this.persistence.remove(PKEY.TOKEN);
        this.persistence.remove(PKEY.PERMISOS_USER);
        this.persistence.remove(PKEY.PERMISOS_LIST);
        this.persistence.remove(PKEY.USUARIO_LOGEAD);

        // Return the observable
        return of(true);
    }


    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return of(true);
    }

    get permisosUser(): any {
        return this.persistence.get(PKEY.PERMISOS_USER);
    }

    checkPermiso(modulo: string): boolean {
        const hasPermissions = this.permisosUser?.find((permiso: any) => permiso.permiso_modulo === modulo);
        return !!hasPermissions;
    }
}
