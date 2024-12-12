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
    <div className="flex items-center gap-1 text-sm ml-auto pl-1">
      <LanguageToggle />
      <ThemeToggle />
    </div>
  );
}
