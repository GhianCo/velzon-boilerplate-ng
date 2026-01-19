import {Injectable} from '@angular/core';
import {HttpService} from "@sothy/services/http.service";
import {Observable} from "rxjs";
import {environment} from "@environments/environment";
import {PersistenceService} from "@sothy/services/persistence.service";
import {map} from "rxjs/operators";
import {InventarioEfectivoMapper} from "@app/inventario-efectivo/data-access/mappers/inventario.efectivo.mapper";
import {
  CuadreSumaDiariaMapper,
  CategoriasConRegistrosMapper
} from "@app/control-interno/cuadre-suma-diaria/data-access/mappers/cuadre.suma.diaria.mapper";
import {CategoriasConControlMapper} from "@app/control-interno/cuadre-suma-diaria/data-access/mappers/categorias.con.control.mapper";

@Injectable({
  providedIn: 'root'
})
export class CuadreSumaDiariaRemoteReq {

  private _cuadreSumaDiariaMapper = new CuadreSumaDiariaMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private httpService: HttpService,
    private _persistenceService: PersistenceService
  ) {}

  /**
   * Buscar operaciones turno por criterio
   */
  requestSearchByCriteria(criteria: any): Observable<any> {
    return this.httpService.post(this.REMOTE_API_URI + `resumencontrolinterno/searchByParams`, criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this._cuadreSumaDiariaMapper.transform(response.data);
          }
          return response;
        })
      );;
  }

  /**
   * Obtener todos los turnos
   */
  requestAllTurnos(): Observable<any> {
    const salaId = this._persistenceService.getSalaId();
    return this.httpService.get(this.REMOTE_API_URI + `turno/sala/${salaId}`);
  }

  /**
   * Obtener categorías con registros por rango de fechas
   * @param startDate Fecha de inicio en formato YYYY-MM-DD
   * @param endDate Fecha fin en formato YYYY-MM-DD
   */
  requestCategoriasConRegistros(startDate: string, endDate: string): Observable<any> {
    return this.httpService.get(this.REMOTE_API_URI + `operacionturno/categorias-con-registros/${startDate}/${endDate}`)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = CategoriasConRegistrosMapper.transform(response.data);
          }
          return response;
        })
      );
  }

  /**
   * Guardar cuadre de suma diaria
   * @param data Datos del cuadre a guardar
   */
  requestGuardarCuadre(data: any): Observable<any> {
    return this.httpService.post(this.REMOTE_API_URI + 'resumencontrolinterno/guardar-resumen', data);
  }

  /**
   * Obtener categorías con control por ID de resumen
   * @param id ID del resumen de control interno
   */
  requestCategoriasConControl(id: string): Observable<any> {
    return this.httpService.get(this.REMOTE_API_URI + `resumencontrolinterno/categorias-con-control/${id}`)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = CategoriasConControlMapper.transform(response.data);
          }
          return response;
        })
      );
  }
}
