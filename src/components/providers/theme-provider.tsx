/**
 * ThemeProvider — gestion centralisée du thème (light / dark / system).
 * - Persistance localStorage du choix utilisateur
 * - Détection automatique des préférences système via `prefers-color-scheme`
 * - Application de la classe `dark` sur `<html>` (compatible Tailwind v4)
 * - Logique de "préservation du thème à la déconnexion" via sessionStorage
 */

'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

// Modes supportés : choix explicite ou suivi du système.
type Theme = 'light' | 'dark' | 'system';

// Forme du contexte exposé aux consommateurs.
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  keepThemeOnSignOut: boolean;
  setKeepThemeOnSignOut: (keep: boolean) => void;
  signOut: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Clés localStorage / sessionStorage utilisées pour la persistance.
const THEME_STORAGE_KEY = 'linxos-theme';
const KEEP_THEME_STORAGE_KEY = 'linxos-keep-theme';
const SESSION_THEME_KEY = 'linxos-theme-session';

/**
 * Bascule la classe `dark` sur `<html>` — déclenche la cascade Tailwind.
 */
function applyResolvedTheme(resolved: 'light' | 'dark') {
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Hook bas niveau : renvoie le contexte thème.
 * Lève une erreur s'il est utilisé hors d'un `ThemeProvider`.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Composant Provider — monte l'état thème au plus haut de l'arbre.
 * Synchronise localStorage, écoute les changements de préférence système,
 * et expose les setters + le helper `signOut`.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [keepThemeOnSignOut, setKeepThemeOnSignOutState] = useState<boolean>(true);

  // Au montage : restaure le thème et la préférence "keep on sign out".
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const storedKeep = localStorage.getItem(KEEP_THEME_STORAGE_KEY);
    if (storedTheme) setThemeState(storedTheme);
    if (storedKeep !== null) setKeepThemeOnSignOutState(storedKeep === 'true');
  }, []);

  // À chaque changement de `theme` (ou de préférence système) : résout et applique.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      const resolved = theme === 'system'
        ? (mediaQuery.matches ? 'dark' : 'light')
        : theme;
      setResolvedTheme(resolved);
      applyResolvedTheme(resolved);
    };

    updateResolvedTheme();

    const handleChange = () => updateResolvedTheme();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Persistance du thème choisi.
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Persistance de l'option "préserver le thème à la déconnexion".
  useEffect(() => {
    localStorage.setItem(KEEP_THEME_STORAGE_KEY, String(keepThemeOnSignOut));
  }, [keepThemeOnSignOut]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const setKeepThemeOnSignOut = useCallback((keep: boolean) => {
    setKeepThemeOnSignOutState(keep);
  }, []);

  /**
   * Helper de déconnexion : selon la préférence `keepThemeOnSignOut`,
   * on conserve (sessionStorage) ou on efface (localStorage) le thème.
   */
  const signOut = useCallback(() => {
    if (keepThemeOnSignOut) {
      sessionStorage.setItem(SESSION_THEME_KEY, THEME_STORAGE_KEY);
    } else {
      sessionStorage.removeItem(SESSION_THEME_KEY);
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  }, [keepThemeOnSignOut]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, resolvedTheme, keepThemeOnSignOut, setKeepThemeOnSignOut, signOut }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
