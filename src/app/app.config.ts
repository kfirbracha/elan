import { APP_INITIALIZER, ApplicationConfig, inject, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideTranslateLoader } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { InlineTranslateLoader } from './inline-translate.loader';

const STORAGE_LANG_KEY = 'titangate-lang';
const SUPPORTED_CODES = ['en', 'fr', 'pt-BR', 'pt-MZ'] as const;

function initTranslations() {
  const translate = inject(TranslateService);
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_LANG_KEY) : null;
  const lang = saved && (SUPPORTED_CODES as readonly string[]).includes(saved) ? saved : 'en';
  translate.setDefaultLang('en');
  return () => firstValueFrom(translate.use(lang));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: provideTranslateLoader(InlineTranslateLoader),
      })
    ),
    { provide: APP_INITIALIZER, useFactory: initTranslations, multi: true },
  ],
};
