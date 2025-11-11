import {ApplicationConfig, importProvidersFrom} from "@angular/core";
import {
  PreloadAllModules,
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withPreloading
} from "@angular/router";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {JwtInterceptor} from "@velzon/core/helpers/jwt.interceptor";
import {ErrorInterceptor} from "@velzon/core/helpers/error.interceptor";
import {FakeBackendInterceptor} from "@velzon/core/helpers/fake-backend";
import {NgPipesModule} from "ngx-pipes";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {StoreModule} from "@ngrx/store";
import {rootReducer} from "@velzon/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "@environments/environment";
import {EffectsModule} from "@ngrx/effects";
import {AuthenticationEffects} from "@velzon/store/Authentication/authentication.effects";
import {EcommerceEffects} from "@velzon/store/Ecommerce/ecommerce_effect";
import {ProjectEffects} from "@velzon/store/Project/project_effect";
import {TaskEffects} from "@velzon/store/Task/task_effect";
import {CRMEffects} from "@velzon/store/CRM/crm_effect";
import {CryptoEffects} from "@velzon/store/Crypto/crypto_effect";
import {InvoiceEffects} from "@velzon/store/Invoice/invoice_effect";
import {TicketEffects} from "@velzon/store/Ticket/ticket_effect";
import {FileManagerEffects} from "@velzon/store/File Manager/filemanager_effect";
import {TodoEffects} from "@velzon/store/Todo/todo_effect";
import {ApplicationEffects} from "@velzon/store/Jobs/jobs_effect";
import {ApikeyEffects} from "@velzon/store/APIKey/apikey_effect";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {initFirebaseBackend} from "./authUtils";
import {appRoutes} from "./app.routes";
import {FlatpickrModule} from "angularx-flatpickr";
import {FeatherModule} from "angular-feather";
import {allIcons} from 'angular-feather/icons';
import {NgxEchartsModule} from "ngx-echarts";
import {HttpService, httpServiceCreator} from "@sothy/services/http.service";
import {
  HOT_GLOBAL_CONFIG,
  HotGlobalConfig,
  NON_COMMERCIAL_LICENSE,
} from "@handsontable/angular-wrapper";
import { registerLanguageDictionary, deDE } from 'handsontable/i18n';
registerLanguageDictionary(deDE);

const globalHotConfig: HotGlobalConfig = {
  license: NON_COMMERCIAL_LICENSE,
  layoutDirection: "ltr",
  language: deDE.languageCode,
  themeName: "ht-theme-main",
};

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
    {provide: HOT_GLOBAL_CONFIG, useValue: globalHotConfig},
    provideHttpClient(),
    // Interceptores HTTP
    {provide: 'HTTP_INTERCEPTORS', useClass: JwtInterceptor, multi: true},
    {provide: 'HTTP_INTERCEPTORS', useClass: ErrorInterceptor, multi: true},
    {provide: 'HTTP_INTERCEPTORS', useClass: FakeBackendInterceptor, multi: true},
    {
      provide: HttpService,
      useFactory: httpServiceCreator,
      deps: [HttpClient]
    },
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
