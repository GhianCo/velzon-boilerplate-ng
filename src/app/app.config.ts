import {ApplicationConfig, APP_INITIALIZER, importProvidersFrom} from "@angular/core";
import {
  PreloadAllModules,
  provideRouter, withHashLocation,
  withInMemoryScrolling,
  withPreloading
} from "@angular/router";
import {HttpClient, provideHttpClient, withInterceptors} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {ErrorInterceptor} from "@velzon/core/helpers/error.interceptor";
import {FakeBackendInterceptor} from "@velzon/core/helpers/fake-backend";
import {sslErrorHandlerInterceptor} from "@sothy/interceptors/ssl-error-handler.interceptor";
import {NgPipesModule} from "ngx-pipes";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {StoreModule} from "@ngrx/store";
import {rootReducer} from "@velzon/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "@environments/environment";
import {EffectsModule} from "@ngrx/effects";
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
import {AlertService, alertServiceFactory} from "@sothy/services/alert.service";
import {provideAuth} from "@sothy/providers/auth.provider";
import {KeycloakInitializerService} from "@app/account/services/keycloak-initializer.service";
import {SalaInitializerService} from "@app/account/services/sala-initializer.service";

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

/**
 * Factory para inicializar el adaptador Keycloak (check-sso + intercambio de token)
 */
export function initializeKeycloak(
  keycloakInitializerService: KeycloakInitializerService
): () => Promise<void> {
  return () => keycloakInitializerService.initialize();
}

/**
 * Factory para cargar los datos de sala desde el backend de salas.
 * Corre en paralelo con el initializer de KC pero awaita authReady internamente,
 * por lo que siempre se ejecuta DESPUÉS de que el token está disponible.
 */
export function initializeSala(
  salaInitializerService: SalaInitializerService
): () => Promise<void> {
  return () => salaInitializerService.initialize();
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
      withHashLocation(),
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({scrollPositionRestoration: 'enabled'})
    ),
    {provide: HOT_GLOBAL_CONFIG, useValue: globalHotConfig},
    // APP_INITIALIZER para SSO con Keycloak
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakInitializerService],
      multi: true
    },
    // APP_INITIALIZER para cargar datos de sala (sala_id, gerente, supervisores).
    // Awaita internamente que KC haya guardado el token antes de llamar al backend de salas.
    {
      provide: APP_INITIALIZER,
      useFactory: initializeSala,
      deps: [SalaInitializerService],
      multi: true
    },
    // Configuración de HttpClient con interceptores funcionales
    provideHttpClient(
      withInterceptors([sslErrorHandlerInterceptor])
    ),
    provideAuth(),
    // Interceptores HTTP (clase legacy - mantener solo si son necesarios)
    {provide: 'HTTP_INTERCEPTORS', useClass: ErrorInterceptor, multi: true},
    {provide: 'HTTP_INTERCEPTORS', useClass: FakeBackendInterceptor, multi: true},
    {provide: HttpService,useFactory: httpServiceCreator,deps: [HttpClient]},
    {provide: AlertService, useFactory: alertServiceFactory, deps: []},
    DatePipe,
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
