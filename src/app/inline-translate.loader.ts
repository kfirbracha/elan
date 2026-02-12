import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { TRANSLATIONS } from './translations';

/**
 * Loads translations from in-memory objects so no HTTP request is needed.
 * Guarantees translated values show immediately (no keys).
 */
export class InlineTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    const data = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] ?? TRANSLATIONS.en;
    return of(data as TranslationObject);
  }
}
