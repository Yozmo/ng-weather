import {enableProdMode, importProvidersFrom} from '@angular/core';

import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {routing} from './app/app.routing';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule, bootstrapApplication} from '@angular/platform-browser';
import {cacheResponseInterceptor} from './app/interceptors/cache-response.interceptor';
import {provideHttpClient, withInterceptors} from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      routing,
      ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    ),
    provideHttpClient(withInterceptors([cacheResponseInterceptor])),
  ],
});
