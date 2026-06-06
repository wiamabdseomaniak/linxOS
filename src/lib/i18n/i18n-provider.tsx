'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { ACTIVE_LANGUAGES, DEFAULT_LANGUAGE, isLanguageCode, LANGUAGES, type LanguageCode } from './languages';
import { translations } from './translations';

interface I18nContextValue {
  language: LanguageCode;
  setLanguage: (code: string) => void;
  t: (path: string) => string;
  dir: 'ltr' | 'rtl';
  availableLanguages: typeof ACTIVE_LANGUAGES;
  defaultLanguage: LanguageCode;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = 'linxos-language';

function getPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isLanguageCode(stored)) {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    const meta = LANGUAGES.find((l) => l.code === language);
    document.documentElement.lang = language;
    document.documentElement.dir = meta?.rtl ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = useCallback((code: string) => {
    if (isLanguageCode(code)) {
      setLanguageState(code);
    }
  }, []);

  const t = useCallback(
    (path: string) => {
      const value = getPath(translations[language], path);
      if (typeof value === 'string') return value;
      const fallback = getPath(translations[DEFAULT_LANGUAGE], path);
      if (typeof fallback === 'string') return fallback;
      return path;
    },
    [language],
  );

  const dir: 'ltr' | 'rtl' = useMemo(
    () => (LANGUAGES.find((l) => l.code === language)?.rtl ? 'rtl' : 'ltr'),
    [language],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t,
      dir,
      availableLanguages: ACTIVE_LANGUAGES,
      defaultLanguage: DEFAULT_LANGUAGE,
    }),
    [language, setLanguage, t, dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}

export function useTranslation() {
  const { t, language, setLanguage, dir, availableLanguages } = useI18n();
  return { t, language, setLanguage, dir, availableLanguages };
}
