'use client';

import * as React from 'react';
import { Languages, Moon, Sun } from 'lucide-react';

import { Button } from 'src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from 'src/components/ui/dropdown-menu';
import { useState } from 'react';
import { getLocale } from 'next-intl/server';

export default function LanguageToggle() {
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default selected language

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Languages className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Change Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="space-y-1">
          <DropdownMenuItem
            onClick={() => handleLanguageChange('en')}
            className={selectedLanguage === 'en' ? 'bg-muted' : ''}
          >
            English
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleLanguageChange('fr')}
            className={selectedLanguage === 'fr' ? 'bg-muted' : ''}
          >
            Français
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
