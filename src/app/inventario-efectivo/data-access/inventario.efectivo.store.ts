import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SignalStore} from "@shared/data-access/signal.store";
import {InventarioEfectivoRemoteReq} from "@app/inventario-efectivo/data-access/inventario.efectivo.remote.req";
import {catchError, finalize, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {PARAM} from "@shared/constants/app.const";

export type IState = {
  inventarioEfectivoLoading: boolean,
  inventarioEfectivoData: any,
  inventarioEfectivoPagination: any,
  inventarioEfectivoError: any,

  filtersToApply: any,
}

const initialState: IState = {
  inventarioEfectivoLoading: false,
  inventarioEfectivoData: null,
  inventarioEfectivoPagination: null,
  inventarioEfectivoError: null,

  filtersToApply: {
    query: PARAM.UNDEFINED,
    page: 1,
    perPage: 10,
  },

};

@Injectable({providedIn: 'root'})
export class InventarioEfectivoStore extends SignalStore<IState> {

  public readonly vm = this.selectMany([
    'inventarioEfectivoLoading',
    'inventarioEfectivoData',
    'inventarioEfectivoPagination',
    'inventarioEfectivoError',
    'filtersToApply'
  ]);

  constructor(
    private _router: Router,
    private _inventarioEfectivoRemoteReq: InventarioEfectivoRemoteReq,
    private _activatedRoute: ActivatedRoute,
  ) {
    super();
    this.initialize(initialState);
  }

  public async loadSearch(criteria: any) {
    this.patch({inventarioEfectivoLoading: true, inventarioEfectivoError: null});
    this._inventarioEfectivoRemoteReq.requestSearchByCriteria(criteria).pipe(
      tap(async ({data, pagination}) => {
        this.patch({
          inventarioEfectivoData: data,
          inventarioEfectivoPagination: pagination,
        })
      }),
      finalize(async () => {
        this.patch({inventarioEfectivoLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          inventarioEfectivoError: error
        }));
      }),
    ).subscribe();
  };

  public get filtersToApply() {
    const state = this.vm();
    return state.filtersToApply
  };

  public loadAllInvetarioEfectivoStore(): Observable<any> {
    this.loadSearch(this.filtersToApply);
    return of(true);
  };

  public changePagination(pageNumber: number) {
    const filtersToApply = this.vm().filtersToApply;
    filtersToApply.page = pageNumber;
    this.loadAllInvetarioEfectivoStore();
    this.patch({ filtersToApply });
  };

}
