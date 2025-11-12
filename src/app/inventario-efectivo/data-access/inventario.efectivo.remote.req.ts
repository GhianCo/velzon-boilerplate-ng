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
    return this.http.post(this.REMOTE_API_URI + 'inventario/searchByParams', criteria)
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
  requestSaveInventario(inventarioWithDetails: any): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'inventario/saveWithDetails', inventarioWithDetails)
  }

}
