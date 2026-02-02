import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { provideFormlyCore } from '@ngx-formly/core';
import { formlyConfigOption } from './formly.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFormlyCore([...withFormlyBootstrap(), formlyConfigOption]),
  ],
};
