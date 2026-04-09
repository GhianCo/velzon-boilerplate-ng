import {Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {IResponse} from "@sothy/interfaces/IResponse";
import {WorkersApiService} from "@sothy/services/workers.api.service";

@Injectable({
  providedIn: 'root'
})

export class AuthLoginRemoteReq {

  private REMOTE_API_URI = environment.publicRest;

  constructor(
    private _workersApiService: WorkersApiService,
  ) {
  }

  requestLogin(login: any): Observable<IResponse> {
    return this._workersApiService.post(this.REMOTE_API_URI + 'liquidaciones/login', login);
  }

  /**
   * Autenticación con token JWT desde sistema externo
   * @param salaId - ID de la sala (sala_id_liquidaciones)
   * @param tokenJwt - Token JWT del sistema externo
   */
  requestAuthWithExternalToken(salaId: string, tokenJwt: string): Observable<IResponse> {
    return this._workersApiService.post(this.REMOTE_API_URI + 'liquidaciones/login-external-token', {
      sala_id: salaId,
      token_jwt: tokenJwt
    });
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
    return this._workersApiService.post(this.REMOTE_API_URI + 'liquidaciones/refresh-token', {
      caja_id: String(cajaId),
      caja_nombre: cajaNombre,
      turno_id: String(turnoId),
      turno_nombre: turnoNombre,
      supervisor: supervisor
    });
  }

}
