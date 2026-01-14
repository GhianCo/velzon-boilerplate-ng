import {Injectable} from '@angular/core';
import {HttpService} from "@sothy/services/http.service";
import {Observable} from "rxjs";
import {environment} from "@environments/environment";
@Injectable({
  providedIn: 'root'
})
export class CuadreSumaDiariaRemoteReq {

  private REMOTE_API_URI = environment.apiRest;

  constructor(private httpService: HttpService) {}
  /**
   * Obtener categorías con registros por rango de fechas
   * @param startDate Fecha de inicio en formato YYYY-MM-DD
   * @param endDate Fecha fin en formato YYYY-MM-DD
   */
  requestCategoriasConRegistros(startDate: string, endDate: string): Observable<any> {
    return this.httpService.get(this.REMOTE_API_URI + `operacionturno/categorias-con-registros/${startDate}/${endDate}`);
  }
  /**
   * Guardar cuadre de suma diaria
   * @param data Datos del cuadre a guardar
   */
  requestGuardarCuadre(data: any): Observable<any> {
    return this.httpService.post('cuadre-suma-diaria', data);
  }
}
