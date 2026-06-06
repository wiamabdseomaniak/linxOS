export const LANGUAGES = [
  { code: 'fr', label: 'Français', nativeLabel: 'Français', flag: 'FR', active: true, rtl: false, default: true },
  { code: 'en', label: 'Anglais', nativeLabel: 'English', flag: 'EN', active: true, rtl: false },
  { code: 'ar', label: 'Arabe', nativeLabel: 'العربية', flag: 'AR', active: true, rtl: true },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export const ACTIVE_LANGUAGES = LANGUAGES.filter((l) => l.active);

export const DEFAULT_LANGUAGE: LanguageCode = 'fr';

export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGES.some((l) => l.code === value && l.active);
}
