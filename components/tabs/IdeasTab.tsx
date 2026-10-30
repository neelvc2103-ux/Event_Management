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
  ChefHat,
  Coffee,
  Candy,
  Flame,
} from 'lucide-react';
import { IdeasData, IdeaSectionKey } from '@/types';
import { CURATED_VISUALS } from '@/lib/visualAssets';

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
      <div className="space-y-3 pb-3 border-b border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">{icon}</div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground font-serif tracking-tight">
                {title}
              </h3>
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
              {isFeedbackOpen ? 'Close Prompt' : 'Custom Prompt'}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleRegenerate(sectionKey)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>{isLoading ? 'Re-crafting...' : 'Regenerate'}</span>
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
              placeholder={`Give instructions for ${title} (e.g. "make it more royal Rajputana", "focus on street chaats", "eco-friendly brass gifts")...`}
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

  // Predefined authentic food photo mappings
  const foodCards = [
    {
      title: 'Live Street Chaat Studio',
      icon: Flame,
      image: CURATED_VISUALS.food.chaat,
      badge: 'Live Interactive Counter',
      items: ideas.menu?.filter((m) => m.toLowerCase().includes('chaat') || m.toLowerCase().includes('snack') || m.toLowerCase().includes('pizza')) || [],
      fallback: ideas.menu?.[0] || 'Live Golgappe, Sev Puri, Dahi Bhalla & Ragda Pattice',
    },
    {
      title: 'Shahi Bhojan Main Banquet',
      icon: ChefHat,
      image: CURATED_VISUALS.food.thali,
      badge: 'Regional Specialties',
      items: ideas.menu?.filter((m) => m.toLowerCase().includes('main') || m.toLowerCase().includes('bhojan') || m.toLowerCase().includes('buffet') || m.toLowerCase().includes('puri')) || [],
      fallback: ideas.menu?.[1] || 'Traditional Dal Baati, Paneer Makhani, Gujarati Kadhi & Pulao',
    },
    {
      title: 'Artisanal Mithai & Desserts',
      icon: Candy,
      image: CURATED_VISUALS.food.mithai,
      badge: 'Sweet Celebrations',
      items: ideas.menu?.filter((m) => m.toLowerCase().includes('dessert') || m.toLowerCase().includes('mithai') || m.toLowerCase().includes('cake') || m.toLowerCase().includes('laddoo')) || [],
      fallback: ideas.menu?.[2] || 'Hot Jalebi Rabdi, Kesar Angoori Rasmalai & Gulab Jamun',
    },
    {
      title: 'Welcome Beverages & Coolers',
      icon: Coffee,
      image: CURATED_VISUALS.food.drinks,
      badge: 'Refreshing Sips',
      items: ideas.menu?.filter((m) => m.toLowerCase().includes('beverage') || m.toLowerCase().includes('drink') || m.toLowerCase().includes('cooler') || m.toLowerCase().includes('sherbet')) || [],
      fallback: ideas.menu?.[3] || 'Fresh Tender Coconut, Kokum Sharbat, Masala Chaas & Mango Lassi',
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. THEMES & AESTHETIC MOODBOARDS (AuraWed Editorial Style) */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {renderSectionHeader(
          'Aesthetic Themes & Scenography Moodboards',
          'themes',
          <Palette className="w-5 h-5 text-primary" />,
          'Curated color palettes, architectural motifs & atmospheric styling'
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ideas.themes?.map((theme, idx) => {
            const themeImg =
              theme.imageUrl ||
              (idx === 0
                ? CURATED_VISUALS.themes.royal
                : idx === 1
                ? CURATED_VISUALS.themes.pastel
                : CURATED_VISUALS.themes.boho);

            const palette =
              theme.palette ||
              (idx === 0
                ? ['#8B1E3F', '#F59E0B', '#D4AF37', '#FAF8F5']
                : idx === 1
                ? ['#FCE7F3', '#F3E8FF', '#D1FAE5', '#FDF4FF']
                : ['#E2725B', '#F59E0B', '#F43F5E', '#FEF3C7']);

            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Theme Photo Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-muted">
                    <img
                      src={themeImg}
                      alt={theme.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                        Concept 0{idx + 1}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-base font-serif font-bold text-white drop-shadow-md">
                        {theme.name}
                      </h4>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {theme.description}
                    </p>

                    {/* Color Palette Swatches */}
                    <div className="pt-2 border-t border-border/60">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                        Harmonized Palette
                      </span>
                      <div className="flex items-center gap-2">
                        {palette.map((color, cIdx) => (
                          <div
                            key={cIdx}
                            className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. REGIONAL CUISINE & LIVE FOOD STATIONS (With Food Photography) */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {renderSectionHeader(
          'Curated Culinary Spread & Live Food Studios',
          'menu',
          <Utensils className="w-5 h-5 text-primary" />,
          'Authentic street chaat counters, regional delicacies, sweets & traditional drinks'
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foodCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col sm:flex-row group hover:border-primary/40 transition-all"
              >
                {/* Photo Side */}
                <div className="relative w-full sm:w-44 h-36 sm:h-auto overflow-hidden bg-muted shrink-0">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white">
                    {card.badge}
                  </span>
                </div>

                {/* Content Side */}
                <div className="p-4 sm:p-5 flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    <span>{card.title}</span>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1 leading-relaxed">
                    {card.items.length > 0 ? (
                      card.items.map((item, itemIdx) => (
                        <p key={itemIdx} className="line-clamp-2">
                          • {item.replace(/^[A-Za-z\s]+:\s*/, '')}
                        </p>
                      ))
                    ) : (
                      <p>{card.fallback}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DECOR & SCENOGRAPHY */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {renderSectionHeader(
          'Decor, Florals & Ambient Scenography',
          'decor',
          <Sparkles className="w-5 h-5 text-primary" />,
          'Mandap elements, fresh marigold carpets, fairy lighting & interactive backdrops'
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ideas.decor?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors flex items-start gap-3.5 text-xs sm:text-sm leading-relaxed text-foreground"
            >
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ENTERTAINMENT & PERFORMANCES */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {renderSectionHeader(
          'Entertainment, Folk Music & Performances',
          'entertainment',
          <Music className="w-5 h-5 text-primary" />,
          'Live Dhol-Tasha, DJs, Sangeet choreography, magic shows & acoustic folk artists'
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ideas.entertainment?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors flex items-start gap-3.5 text-xs sm:text-sm leading-relaxed text-foreground"
            >
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent-foreground font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                ★
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RETURN GIFTS & SOUVENIRS */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {renderSectionHeader(
          'Return Favors & Bespoke Souvenirs',
          'giftsAndFavors',
          <Gift className="w-5 h-5 text-primary" />,
          'Artisanal sweets, silver coins, handcrafted potlis & eco-seed plantable hampers'
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ideas.giftsAndFavors?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors flex items-start gap-3.5 text-xs sm:text-sm leading-relaxed text-foreground"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                🎁
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. MULTI-GENERATIONAL & ACCESSIBILITY ACCOMMODATION (SME Explainer Directive) */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1 pb-3 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-accent/20 text-accent-foreground font-bold">
              <span>♿</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground font-serif tracking-tight flex items-center gap-2">
                <span>Multi-Generational & Accessibility Blueprint</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-sans">
                  All Ages Curation
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Tailored provisions for elders, toddlers, dietary restrictions and physical accessibility
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2">
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span>👵</span>
              <span>Elder Family Comfort</span>
            </span>
            <ul className="space-y-1 text-muted-foreground text-[11px] leading-relaxed">
              <li>• Ground-floor cushioned sofa seating directly facing Muhurat rituals</li>
              <li>• Wheelchair ramp gradient verified at main banquet & stage entry</li>
              <li>• Low-decibel acoustic lounge away from 120dB live Dhol-Tasha</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2">
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span>👶</span>
              <span>Kids & Toddlers Play Nook</span>
            </span>
            <ul className="space-y-1 text-muted-foreground text-[11px] leading-relaxed">
              <li>• Supervised activity table with coloring sheets & balloon crafts</li>
              <li>• Mild finger food counter (potato wedges, mini idlis, fruit skewers)</li>
              <li>• Safe buffer zone away from stage power cables and halogen lamps</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2">
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span>🥗</span>
              <span>Dietary & Satvik Separation</span>
            </span>
            <ul className="space-y-1 text-muted-foreground text-[11px] leading-relaxed">
              <li>• 100% separate Jain catering counter (strictly no onion, garlic, or root crops)</li>
              <li>• Sugar-free / diabetic dessert counter clearly labeled in Gujarati/Hindi</li>
              <li>• Nut-free children snack trays to prevent accidental allergic triggers</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2">
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span>🚗</span>
              <span>Arrival & Valet Logistics</span>
            </span>
            <ul className="space-y-1 text-muted-foreground text-[11px] leading-relaxed">
              <li>• Priority golf-cart shuttle from parking lot to entrance archway</li>
              <li>• Express baggage check-in desk for guests arriving straight from airport</li>
              <li>• Umbrella & shade canopies along walkway during afternoon Muhurat</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
