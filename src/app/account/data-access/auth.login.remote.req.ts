import {Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {IResponse} from "@sothy/interfaces/IResponse";
import {ControlActivosApiService} from "@sothy/services/control.activos.api.service";
import {WorkersApiService} from "@sothy/services/workers.api.service";

@Injectable({
  providedIn: 'root'
})

export class AuthLoginRemoteReq {

  private REMOTE_API_URI = environment.publicRest;

  constructor(
    private _controlactivosApiService: ControlActivosApiService,
    private _workersApiService: WorkersApiService,
  ) {
  }

  requestSalas(): Observable<IResponse> {
    return this._controlactivosApiService.get(this.REMOTE_API_URI + 'sala');
  }

  requestLogin(login: any): Observable<IResponse> {
    return this._workersApiService.post(this.REMOTE_API_URI + 'liquidaciones/login', login);
  }

}
