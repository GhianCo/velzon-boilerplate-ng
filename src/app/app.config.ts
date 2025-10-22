import {ApplicationConfig, importProvidersFrom} from "@angular/core";
import {
  PreloadAllModules,
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withPreloading
} from "@angular/router";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {JwtInterceptor} from "./core/helpers/jwt.interceptor";
import {ErrorInterceptor} from "./core/helpers/error.interceptor";
import {FakeBackendInterceptor} from "./core/helpers/fake-backend";
import {NgPipesModule} from "ngx-pipes";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {StoreModule} from "@ngrx/store";
import {rootReducer} from "./store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "@environments/environment";
import {EffectsModule} from "@ngrx/effects";
import {AuthenticationEffects} from "./store/Authentication/authentication.effects";
import {EcommerceEffects} from "./store/Ecommerce/ecommerce_effect";
import {ProjectEffects} from "./store/Project/project_effect";
import {TaskEffects} from "./store/Task/task_effect";
import {CRMEffects} from "./store/CRM/crm_effect";
import {CryptoEffects} from "./store/Crypto/crypto_effect";
import {InvoiceEffects} from "./store/Invoice/invoice_effect";
import {TicketEffects} from "./store/Ticket/ticket_effect";
import {FileManagerEffects} from "./store/File Manager/filemanager_effect";
import {TodoEffects} from "./store/Todo/todo_effect";
import {ApplicationEffects} from "./store/Jobs/jobs_effect";
import {ApikeyEffects} from "./store/APIKey/apikey_effect";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {initFirebaseBackend} from "./authUtils";
import {appRoutes} from "./app.routes";
import {FlatpickrModule} from "angularx-flatpickr";
import {FeatherModule} from "angular-feather";
import {allIcons} from 'angular-feather/icons';
import {NgxEchartsModule} from "ngx-echarts";

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  FakeBackendInterceptor;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      //withHashLocation(),
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({scrollPositionRestoration: 'enabled'})
    ),
    provideHttpClient(withInterceptorsFromDi()),
    // Interceptores HTTP
    {provide: 'HTTP_INTERCEPTORS', useClass: JwtInterceptor, multi: true},
    {provide: 'HTTP_INTERCEPTORS', useClass: ErrorInterceptor, multi: true},
    {provide: 'HTTP_INTERCEPTORS', useClass: FakeBackendInterceptor, multi: true},
    importProvidersFrom(
      BrowserAnimationsModule,
      NgPipesModule,
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
      StoreModule.forRoot(rootReducer),
      StoreDevtoolsModule.instrument({
        maxAge: 25,
        logOnly: environment.production,
      }),
      EffectsModule.forRoot([
        AuthenticationEffects,
        EcommerceEffects,
        ProjectEffects,
        TaskEffects,
        CRMEffects,
        CryptoEffects,
        InvoiceEffects,
        TicketEffects,
        FileManagerEffects,
        TodoEffects,
        ApplicationEffects,
        ApikeyEffects,
      ]),
      FlatpickrModule.forRoot(),
      FeatherModule.pick(allIcons),
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
    ),
  ]
}
