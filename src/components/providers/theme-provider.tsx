'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  keepThemeOnSignOut: boolean;
  setKeepThemeOnSignOut: (keep: boolean) => void;
  signOut: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'linxos-theme';
const KEEP_THEME_STORAGE_KEY = 'linxos-keep-theme';
const SESSION_THEME_KEY = 'linxos-theme-session';

function applyResolvedTheme(resolved: 'light' | 'dark') {
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

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

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [keepThemeOnSignOut, setKeepThemeOnSignOutState] = useState<boolean>(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const storedKeep = localStorage.getItem(KEEP_THEME_STORAGE_KEY);
    if (storedTheme) setThemeState(storedTheme);
    if (storedKeep !== null) setKeepThemeOnSignOutState(storedKeep === 'true');
  }, []);

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

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(KEEP_THEME_STORAGE_KEY, String(keepThemeOnSignOut));
  }, [keepThemeOnSignOut]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const setKeepThemeOnSignOut = useCallback((keep: boolean) => {
    setKeepThemeOnSignOutState(keep);
  }, []);

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
