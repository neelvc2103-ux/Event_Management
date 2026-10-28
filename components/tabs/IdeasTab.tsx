'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Palette,
  Utensils,
  Music,
  Gift,
  Check,
  Send,
  Loader2,
} from 'lucide-react';
import { IdeasData, IdeaSectionKey } from '@/types';

interface IdeasTabProps {
  ideas: IdeasData;
  onRegenerateSection: (section: IdeaSectionKey, userFeedback?: string) => Promise<void>;
}

export function IdeasTab({ ideas, onRegenerateSection }: IdeasTabProps) {
  const [loadingSection, setLoadingSection] = useState<IdeaSectionKey | null>(null);
  const [activeFeedbackSection, setActiveFeedbackSection] = useState<IdeaSectionKey | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleRegenerate = async (section: IdeaSectionKey, feedback?: string) => {
    try {
      setLoadingSection(section);
      await onRegenerateSection(section, feedback);
      setActiveFeedbackSection(null);
      setFeedbackText('');
    } finally {
      setLoadingSection(null);
    }
  };

  const renderSectionHeader = (
    title: string,
    sectionKey: IdeaSectionKey,
    icon: React.ReactNode,
    subtitle: string
  ) => {
    const isLoading = loadingSection === sectionKey;
    const isFeedbackOpen = activeFeedbackSection === sectionKey;

    return (
      <div className="space-y-3 pb-2 border-b border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">{icon}</div>
            <div>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                if (isFeedbackOpen) {
                  setActiveFeedbackSection(null);
                } else {
                  setActiveFeedbackSection(sectionKey);
                  setFeedbackText('');
                }
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              {isFeedbackOpen ? 'Close Prompt' : 'Add Prompt Feedback'}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleRegenerate(sectionKey)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>{isLoading ? 'Regenerating...' : 'Regenerate'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Input Drawer for Specific Section */}
        {isFeedbackOpen && (
          <div className="p-3.5 rounded-xl bg-muted/50 border border-border flex items-center gap-2 animate-fade-in">
            <input
              type="text"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={`Give instructions for ${title} (e.g. "make it more royal", "focus on street food", "eco-friendly gifts")...`}
              className="flex-1 px-3 py-1.5 rounded-lg border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              disabled={isLoading || !feedbackText.trim()}
              onClick={() => handleRegenerate(sectionKey, feedbackText)}
              className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-bold flex items-center gap-1 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>Apply</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. THEMES & AESTHETICS */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        {renderSectionHeader(
          'Aesthetic Themes & Motifs',
          'themes',
          <Palette className="w-5 h-5 text-primary" />,
          'Curated color stories, architectural motifs & atmospheres'
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ideas.themes?.map((theme, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border bg-background/50 hover:border-primary/40 transition-all space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h4 className="text-sm font-bold text-foreground">{theme.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                {theme.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. DECOR & AMBIENCE */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        {renderSectionHeader(
          'Decor & Ambience Ideas',
          'decor',
          <Sparkles className="w-5 h-5 text-primary" />,
          'Mandap elements, floral marigold carpets, fairy lighting & backdrops'
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ideas.decor?.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border/80 bg-background/40 flex items-start gap-3 text-xs leading-relaxed text-foreground"
            >
              <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. REGIONAL MENU & BANQUET */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        {renderSectionHeader(
          'Regional Cuisine & Menu Spread',
          'menu',
          <Utensils className="w-5 h-5 text-primary" />,
          'Live chaat counters, regional delicacies, sweets & traditional drinks'
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ideas.menu?.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border/80 bg-background/40 flex items-start gap-3 text-xs leading-relaxed text-foreground"
            >
              <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ENTERTAINMENT & MUSIC */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        {renderSectionHeader(
          'Entertainment, Music & Performances',
          'entertainment',
          <Music className="w-5 h-5 text-primary" />,
          'Live Dhol-Tasha, DJs, Sangeet games, magic shows & folk artists'
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ideas.entertainment?.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border/80 bg-background/40 flex items-start gap-3 text-xs leading-relaxed text-foreground"
            >
              <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RETURN GIFTS & FAVORS */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        {renderSectionHeader(
          'Gifts, Favors & Souvenirs',
          'giftsAndFavors',
          <Gift className="w-5 h-5 text-primary" />,
          'Artisanal sweets, silver coins, handcrafted potlis & eco-seed hampers'
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ideas.giftsAndFavors?.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border/80 bg-background/40 flex items-start gap-3 text-xs leading-relaxed text-foreground"
            >
              <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
