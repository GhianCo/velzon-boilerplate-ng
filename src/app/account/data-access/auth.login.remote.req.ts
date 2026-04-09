import {Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {Observable, of} from "rxjs";
import {IResponse} from "@sothy/interfaces/IResponse";

@Injectable({
  providedIn: 'root'
})

export class AuthLoginRemoteReq {

  private REMOTE_API_URI = environment.publicRest;

  constructor(
  ) {
  }

  requestLogin(login: any): Observable<IResponse> {
    return of({ code: 200, data: null, message: 'Login exitoso' });
  }

  /**
   * Autenticación con token JWT desde sistema externo
   * @param salaId - ID de la sala (sala_id_liquidaciones)
   * @param tokenJwt - Token JWT del sistema externo
   */
  requestAuthWithExternalToken(salaId: string, tokenJwt: string): Observable<IResponse> {
    return of({ code: 200, data: null, message: 'Autenticación con token JWT exitosa' });
  }

  /**
   * Actualiza el token JWT con nuevas propiedades de caja, turno y supervisor
   * @param cajaId - ID de la caja seleccionada
   * @param cajaNombre - Nombre de la caja seleccionada
   * @param turnoId - ID del turno seleccionado
   * @param turnoNombre - Nombre del turno seleccionado
   * @param supervisor - Nombre del supervisor seleccionado
   */
  requestRefreshToken(
    cajaId: string | number,
    cajaNombre: string,
    turnoId: string | number,
    turnoNombre: string,
    supervisor: string
  ): Observable<IResponse> {
    return of({ code: 200, data: null, message: 'Token JWT actualizado exitosamente' });
  }

}
