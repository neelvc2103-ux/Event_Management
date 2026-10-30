'use client';

import React from 'react';
import { Home, FolderOpen, Plus, Moon, Sun } from 'lucide-react';
import { AyojaLogo } from './AyojaLogo';

interface NavbarProps {
  onGoHome: () => void;
  onOpenSavedPlans: () => void;
  onNewPlan: () => void;
  savedPlansCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Navbar({
  onGoHome,
  onOpenSavedPlans,
  onNewPlan,
  savedPlansCount,
  darkMode,
  onToggleDarkMode,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div
          onClick={onGoHome}
          className="flex items-center cursor-pointer group"
          title="Return to AYOJA Home"
        >
          <AyojaLogo size="md" showWordmark={true} showTagline={false} />
          <span className="hidden md:inline-block ml-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent-foreground border border-accent/30">
            Event Command Center
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dedicated Home Button */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-foreground/80 hover:text-foreground hover:bg-muted/80 transition-all active:scale-95 border border-transparent hover:border-border"
            title="Return to Main Landing Page"
          >
            <Home className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">Home</span>
          </button>

          {/* New Plan Button */}
          <button
            onClick={onNewPlan}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Plan</span>
          </button>

          {/* Saved Plans Button */}
          <button
            onClick={onOpenSavedPlans}
            className="relative flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="My Saved Plans"
          >
            <FolderOpen className="w-3.5 h-3.5 text-primary" />
            <span className="hidden xs:inline">My Plans</span>
            {savedPlansCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-accent text-accent-foreground">
                {savedPlansCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-accent" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
