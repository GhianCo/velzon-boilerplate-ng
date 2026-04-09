import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {InventarioEfectivoMapper} from "@app/inventario-efectivo/data-access/mappers/inventario.efectivo.mapper";
import {IResponse} from "@sothy/interfaces/IResponse";
import {HttpService} from "@sothy/services/http.service";

@Injectable({
  providedIn: 'root'
})

export class InventarioEfectivoRemoteReq {

  private inventarioEfectivoMapper = new InventarioEfectivoMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private http: HttpService,
  ) {
  }

  requestSearchByCriteria(criteria: any): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'operacionturno/searchByParams', criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.inventarioEfectivoMapper.transform(response.data);
          }
          return response;
        })
      );
  }

  requestGetOperacionturnoById(id: number): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'operacionturno/' + id);
  }

  requestGetLastOperacionturno(): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'operacionturno/last');
  }

  requestOperacionTurnoWithDetails(operacionturno_id: any): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + `operacionturno/${operacionturno_id}/details`);
  }

  /**
   * Obtener el resumen completo de una operación de turno
   * Incluye: inventario de apertura, inventario de cierre y suma diaria
   */
  requestResumenOperacionTurno(operacionturno_id: any): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + `operacionturno/${operacionturno_id}/resumen`)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.inventarioEfectivoMapper.transform(response.data);
          }
          return response;
        })
      );;
  }

  requestGetValoresWithDetails(): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'valor/withDetails')
  }

  requestGetValoresWithDetailsByCaja(cajasData: any, operacionTurnoId: any): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'valor/withDetailsByCaja/' + operacionTurnoId, cajasData)
  }

  requestGetCatMovWithDetails(operacionturno_id: any): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'sumdiacatmovimiento/withDetails?operacionturno_id='+operacionturno_id)
  }

  requestSaveInventario(inventarioWithDetails: any): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'operacionturno/saveWithDetails', inventarioWithDetails)
  }

  requestRegistrarTransferenciaCaja(payload: any): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'transferenciacaja', payload);
  }

}
