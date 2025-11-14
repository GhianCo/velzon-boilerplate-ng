import {Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {IResponse} from "@sothy/interfaces/IResponse";
import {LiquidacionesApiService} from "@sothy/services/liquidaciones.api.service";
import {WorkersApiService} from "@sothy/services/workers.api.service";

@Injectable({
  providedIn: 'root'
})

export class AuthLoginRemoteReq {

  private REMOTE_API_URI = environment.publicRest;

  constructor(
    private _liquidacionesApiService: LiquidacionesApiService,
    private _workersApiService: WorkersApiService,
  ) {
  }

  requestSalas(): Observable<IResponse> {
    return this._liquidacionesApiService.get(this.REMOTE_API_URI + 'sala');
  }

  requestLogin(login: any): Observable<IResponse> {
    return this._workersApiService.post(this.REMOTE_API_URI + 'liquidaciones/login', login);
  }

}
