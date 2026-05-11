import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import localeRu from '@angular/common/locales/ru';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeRu, 'ru');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'ru-RU' },
  ],
};
