'use client';

import ThemeToggle from 'src/components/toggle-theme';
import { useState, useEffect } from 'react';
import LanguageToggle from 'src/components/toggle-language';

export function NavActions() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm ml-auto">
      <LanguageToggle />
      <ThemeToggle />
    </div>
  );
}