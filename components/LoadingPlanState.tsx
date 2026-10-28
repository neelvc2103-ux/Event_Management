'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const ROTATING_MESSAGES = [
  'Splitting your budget across authentic Indian vendors...',
  'Calculating backward timeline to ensure zero past dates...',
  'Curating regional menus, Jain/Pure Veg counters & dessert spreads...',
  'Compiling vendor verification questions & negotiation tips...',
  'Harmonizing traditions, muhurat & municipal permissions...',
  'Adding finishing touches to your bespoke event dashboard...',
];

export function LoadingPlanState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center animate-fade-in">
      {/* Central Spinner & Status */}
      <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6 shadow-sm">
        <Sparkles className="w-8 h-8 text-accent animate-spin" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
        EventCraft AI is planning your celebration
      </h2>

      <div className="h-10 mt-3 flex items-center justify-center">
        <p className="text-sm sm:text-base font-medium text-primary animate-pulse transition-all">
          {ROTATING_MESSAGES[messageIndex]}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 max-w-full mx-auto h-1.5 bg-muted rounded-full overflow-hidden mt-4">
        <div className="h-full bg-gradient-to-r from-primary via-maroon-600 to-accent animate-pulse w-3/4 rounded-full" />
      </div>

      {/* Skeleton Dashboard Representation */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left opacity-75">
        {/* Skeleton Card 1: Budget */}
        <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-muted rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-36 h-36 mx-auto rounded-full border-8 border-muted/50 border-t-primary animate-spin" />
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-muted rounded animate-pulse" />
            <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Skeleton Card 2: Timeline */}
        <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/40">
                <div className="w-4 h-4 rounded-full bg-muted animate-pulse mt-0.5 shrink-0" />
                <div className="space-y-1.5 w-full">
                  <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-2 w-1/3 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton Card 3: Vendors & Ideas */}
        <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg border border-border/50 bg-muted/30 space-y-2">
                <div className="h-3.5 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-2.5 w-full bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
