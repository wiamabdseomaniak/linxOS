'use client';

import { useState } from 'react';
import { Languages, Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { language, setLanguage, availableLanguages } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = availableLanguages.find((l) => l.code === language);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Changer de langue"
          >
            <Languages className="h-5 w-5" />
            {current && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {current.flag}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="end" className="w-56 p-1">
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
          Langue
        </div>
        <div className="space-y-0.5">
          {availableLanguages.map((lang) => {
            const active = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  'hover:bg-muted focus:bg-muted focus:outline-none',
                  active && 'bg-muted'
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-9 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                    {lang.flag}
                  </span>
                  <span className="font-medium">{lang.nativeLabel}</span>
                </span>
                {active && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
