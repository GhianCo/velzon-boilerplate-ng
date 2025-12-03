import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {InventarioEfectivoMapper} from "@app/inventario-efectivo/data-access/mappers/inventario.efectivo.mapper";
import {IResponse} from "@sothy/interfaces/IResponse";
import {HttpService} from "@sothy/services/http.service";
import {ControlActivosApiService} from "@sothy/services/control.activos.api.service";

@Injectable({
  providedIn: 'root'
})

export class InventarioEfectivoRemoteReq {

  private inventarioEfectivoMapper = new InventarioEfectivoMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private http: HttpService,
    private _controlActivosApiService: ControlActivosApiService,
  ) {
  }

  requestSearchByCriteria(criteria: any): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'operacionturno/searchByParams', criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data.body = this.inventarioEfectivoMapper.transform(response.data.body);
          }
          return response;
        })
      );
  }

  requestOperacionTurnoWithDetails(operacionturno_id: any): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + `operacionturno/${operacionturno_id}/details`)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data.body = this.inventarioEfectivoMapper.transform(response.data.body);
          }
          return response;
        })
      );
  }

  requestGetValoresWithDetails(): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'valor/withDetails')
  }

  requestGetCatMovWithDetails(): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'sumdiacatmovimiento/withDetails')
  }

  requestSaveInventario(inventarioWithDetails: any): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'inventario/saveWithDetails', inventarioWithDetails)
  }

  requestAllCajasBySala(sala_id: number): Observable<IResponse> {
    return this._controlActivosApiService.get(this.REMOTE_API_URI + 'caja?sala='+sala_id)
  }

  requestGetTurnos(sala_id: number): Observable<IResponse> {
    return this._controlActivosApiService.get(this.REMOTE_API_URI + 'turno?sala='+sala_id)
  }

}
