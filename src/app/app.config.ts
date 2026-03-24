import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideTranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { InlineTranslateLoader } from './inline-translate.loader';

const STORAGE_LANG_KEY = 'titangate-lang';
const SUPPORTED_CODES = ['en', 'ru', 'ar', 'fr', 'pt-MZ', 'pt-BR', 'es', 'zh', 'ja', 'de'] as const;

function initTranslations() {
  const translate = inject(TranslateService);
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_LANG_KEY) : null;
  const lang = saved && (SUPPORTED_CODES as readonly string[]).includes(saved) ? saved : 'en';
  translate.setDefaultLang('en');
  return () => firstValueFrom(translate.use(lang));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: provideTranslateLoader(InlineTranslateLoader),
      }),
    ),
    { provide: APP_INITIALIZER, useFactory: initTranslations, multi: true },
  ],
};
