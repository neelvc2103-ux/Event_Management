'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Moon, Sun, FolderOpen, Plus } from 'lucide-react';

interface NavbarProps {
  onOpenSavedPlans: () => void;
  onNewPlan: () => void;
  savedPlansCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Navbar({
  onOpenSavedPlans,
  onNewPlan,
  savedPlansCount,
  darkMode,
  onToggleDarkMode,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={onNewPlan}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-maroon-600 flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-serif font-black tracking-tight bg-gradient-to-r from-primary via-maroon-700 to-accent dark:from-maroon-400 dark:to-accent bg-clip-text text-transparent">
                EventCraft
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground border border-accent/30">
                Command Center
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onNewPlan}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Plan</span>
          </button>

          <button
            onClick={onOpenSavedPlans}
            className="relative flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            title="My Saved Plans"
          >
            <FolderOpen className="w-3.5 h-3.5 text-primary" />
            <span className="hidden xs:inline">My Plans</span>
            {savedPlansCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {savedPlansCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
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
