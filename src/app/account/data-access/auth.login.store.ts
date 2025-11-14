import {inject, Injectable} from "@angular/core";
import {SignalStore} from "@shared/data-access/signal.store";
import {catchError, finalize, tap} from "rxjs/operators";
import {of} from "rxjs";
import {AuthLoginRemoteReq} from "@app/account/data-access/auth.login.remote.req";
import {AlertService} from "@sothy/services/alert.service";
import {PersistenceService} from "@sothy/services/persistence.service";
import {AuthService} from "@sothy/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

export type IState = {
  salasLoading: boolean,
  salasData: any,
  salasError: any,

  loginLoading: boolean,
  loginData: any,
  loginError: any,

}

const initialState: IState = {
  salasLoading: false,
  salasData: null,
  salasError: null,

  loginLoading: false,
  loginData: null,
  loginError: null,
};

@Injectable({providedIn: 'root'})
export class AuthLoginStore extends SignalStore<IState> {

  public readonly vm = this.selectMany([
    'salasLoading',
    'salasData',
    'salasError',

    'loginLoading',
    'loginData',
    'loginError',
  ]);

  _authService = inject(AuthService);
  _activatedRoute = inject(ActivatedRoute);
  _router = inject(Router);
  _authLoginRemoteReq = inject(AuthLoginRemoteReq);
  _alertService = inject(AlertService);

  constructor() {
    super();
    this.initialize(initialState);
  }

  public async loadSalas() {
    this.patch({salasLoading: true, salasError: null});
    this._authLoginRemoteReq.requestSalas().pipe(
      tap(async ({data, pagination}) => {
        this.patch({
          salasData: data,
        })
      }),
      finalize(async () => {
        this.patch({salasLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          salasError: error
        }));
      }),
    ).subscribe();
  };

  public async loadLogin(login: any) {
    this.patch({loginLoading: true, loginError: null});
    this._authLoginRemoteReq.requestLogin(login).pipe(
      tap(async ({data}) => {
        this.patch({
          loginData: data,
        })
        this._authService.accessToken = data;
        const redirectURL =
          this._activatedRoute.snapshot.queryParamMap.get(
            'redirectURL'
          ) || '/signed-in-redirect';

        // Navigate to the redirect url
        this._router.navigateByUrl(redirectURL);
      }),
      finalize(async () => {
        this.patch({loginLoading: false});
      }),
      catchError((error) => {
        this._alertService.error(error.error.error.description);
        return of(this.patch({
          loginError: error
        }));
      }),
    ).subscribe();
  };

}
