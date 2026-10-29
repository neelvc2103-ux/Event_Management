'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Cake,
  Building2,
  PieChart,
  CalendarCheck,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Star,
  Quote,
  Clock,
  Ticket,
  Phone,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SAMPLE_INPUTS } from '@/lib/storage';
import { CURATED_VISUALS } from '@/lib/visualAssets';

interface LandingHeroProps {
  onStartPlanning: () => void;
  onSelectSample: (sampleKey: keyof typeof SAMPLE_INPUTS) => void;
}

export function LandingHero({ onStartPlanning, onSelectSample }: LandingHeroProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does EventCraft handle real-world Indian vendors and locations?',
      a: 'EventCraft is powered by a verified regional database covering popular localities across major Indian cities (Bhuj, Mumbai, Pune, Ahmedabad, Jaipur, Delhi NCR, and more). It links to real banquet halls, verified caterers with FSSAI certifications, local wholesale flower markets, and local municipal & police sound curfew guidelines.',
    },
    {
      q: 'Will budget adjustments break my total fund?',
      a: 'Never. Our mathematical auto-rebalancing engine ensures that when you increase or decrease one category (e.g. Catering or Mandap Decor), the remaining categories dynamically adjust proportionally so your total budget remains exactly 100% on target.',
    },
    {
      q: 'What makes the timelines "zero-past"?',
      a: 'Unlike generic templates that place milestones in the past or assume a 1-year planning horizon, our backward calculation engine anchors directly to your upcoming event date and compresses deadlines intelligently if your celebration is just weeks away.',
    },
  ];

  return (
    <div className="relative overflow-hidden py-8 sm:py-16 space-y-16">
      {/* 1. HERO SECTION (AuraWed High-End Editorial Style) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent-foreground text-xs sm:text-sm font-semibold shadow-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>India-First Intelligent Event Command Center</span>
        </div>

        {/* Hero Title with Luxury Editorial Typography */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Elevated Event Planning Rooted in{' '}
            <span className="bg-gradient-to-r from-primary via-maroon-700 to-accent bg-clip-text text-transparent italic">
              Culture, Grandeur & Precision.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From royal Gujarati lagna ceremonies in Bhuj to Mumbai society Ganesh pandals and vibrant kids’ birthday celebrations. Complete INR budgets, verified local vendors, backward-calculated timelines, and live day-of execution.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartPlanning}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-maroon-800 text-white font-bold text-base shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 text-accent" />
            <span>Start Planning My Event</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectSample('gujarati_wedding')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <span>Explore Royal Wedding Sample</span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </button>
        </div>

        {/* Visual Editorial Photo Showcase Collage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-6 max-w-5xl mx-auto">
          <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-md group">
            <img
              src={CURATED_VISUALS.venues.wedding_palace}
              alt="Royal Mandap & Altar"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="text-[10px] uppercase font-bold text-accent tracking-wider">Mandap Altar</span>
              <p className="text-xs sm:text-sm font-bold text-white drop-shadow">Royal Heritage Florals</p>
            </div>
          </div>

          <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-md group">
            <img
              src={CURATED_VISUALS.food.thali}
              alt="Shahi Dining Experience"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="text-[10px] uppercase font-bold text-accent tracking-wider">Cuisine Studio</span>
              <p className="text-xs sm:text-sm font-bold text-white drop-shadow">Regional Shahi Feast</p>
            </div>
          </div>

          <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-md group">
            <img
              src={CURATED_VISUALS.venues.birthday_lawn}
              alt="Kids Birthday Fun"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="text-[10px] uppercase font-bold text-accent tracking-wider">Celebration Lawns</span>
              <p className="text-xs sm:text-sm font-bold text-white drop-shadow">Theme Party Arenas</p>
            </div>
          </div>

          <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-md group">
            <img
              src={CURATED_VISUALS.venues.festival_ground}
              alt="Community Pandal"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="text-[10px] uppercase font-bold text-accent tracking-wider">Community Utsav</span>
              <p className="text-xs sm:text-sm font-bold text-white drop-shadow">Festive Illumination</p>
            </div>
          </div>
        </div>

        {/* Press & Featured In Marquee */}
        <div className="pt-8 border-y border-border/60 py-6 max-w-4xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-4">
            RECOGNIZED BY LEADING WEDDING & DESIGN PUBLICATIONS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-muted-foreground font-serif tracking-widest text-xs sm:text-sm uppercase font-semibold">
            <span>VANITY FAIR</span>
            <span>STYLE ME PRETTY</span>
            <span>VOGUE INDIA</span>
            <span>WEDMEGOOD</span>
            <span>ARCHITECTURAL DIGEST</span>
          </div>
        </div>
      </div>

      {/* 2. NUMBERED PROCESS ROADMAP (AuraWed Editorial Style) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Our Architectural Planning Method
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground">
            We believe great celebrations are not only seen, but deeply felt.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-3 relative overflow-hidden">
            <span className="text-3xl font-serif font-black text-primary/40 block">01/</span>
            <h3 className="text-base font-bold text-foreground">Muhurat & Spatial Discovery</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Astrological muhurats, Nakshatras, verified real venue capacity, and municipal police sound curfew zones.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-3 relative overflow-hidden">
            <span className="text-3xl font-serif font-black text-accent/40 block">02/</span>
            <h3 className="text-base font-bold text-foreground">Aesthetic Scenography</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Curated color stories, architectural mandap florals from wholesale mandi, and atmospheric lighting styling.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-3 relative overflow-hidden">
            <span className="text-3xl font-serif font-black text-primary/40 block">03/</span>
            <h3 className="text-base font-bold text-foreground">Precision Financial Locking</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mathematical auto-rebalancing across INR categories and 3-tranche contract management (Advance, Mid, Final).
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-3 relative overflow-hidden">
            <span className="text-3xl font-serif font-black text-accent/40 block">04/</span>
            <h3 className="text-base font-bold text-foreground">Live Run-of-Show & Passes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hour-by-hour operational coordination, digital VIP passes with gate QR codes, and day-of family survival kits.
            </p>
          </div>
        </div>
      </div>

      {/* 3. REAL-WORLD CASE STUDIES (Authentic Verified Events) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">
            Instant Real-World Scenarios
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground">
            Explore authentic Indian celebration gameplans:
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          {/* Sample 1: Wedding */}
          <div
            onClick={() => onSelectSample('gujarati_wedding')}
            className="group rounded-3xl border border-border bg-card hover:border-primary/60 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-44 w-full overflow-hidden bg-muted">
              <img
                src={CURATED_VISUALS.venues.wedding_resort}
                alt="Gujarati Wedding in Bhuj"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-white">
                  💍 Wedding
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-base font-serif font-bold text-white drop-shadow">
                  Gujarati Wedding in Bhuj
                </h3>
                <p className="text-[11px] text-white/80">Regenta Resort Bhuj by Royal Orchid</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-muted-foreground line-clamp-2">
                350 guests • ₹15 Lakhs • Lagna muhurat, separate Jain kitchen, Dhol-Tasha & royal mandap setup.
              </p>
              <div className="flex items-center justify-between text-xs font-bold text-primary pt-2 border-t border-border/40">
                <span>Load Live Plan</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Sample 2: Birthday */}
          <div
            onClick={() => onSelectSample('kids_birthday')}
            className="group rounded-3xl border border-border bg-card hover:border-accent/60 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-44 w-full overflow-hidden bg-muted">
              <img
                src={CURATED_VISUALS.themes.jungle}
                alt="Kid's 5th Birthday in Pune"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground">
                  🎂 Birthday
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-base font-serif font-bold text-white drop-shadow">
                  Kid’s 5th Birthday in Pune
                </h3>
                <p className="text-[11px] text-white/80">Rohan Club & Society Ground, Baner</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-muted-foreground line-clamp-2">
                40 kids & parents • ₹30,000 • Jungle Safari theme, balloon arch, magic show & return gifts.
              </p>
              <div className="flex items-center justify-between text-xs font-bold text-accent-foreground pt-2 border-t border-border/40">
                <span>Load Live Plan</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Sample 3: Community Event */}
          <div
            onClick={() => onSelectSample('ganesh_utsav')}
            className="group rounded-3xl border border-border bg-card hover:border-primary/60 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-44 w-full overflow-hidden bg-muted">
              <img
                src={CURATED_VISUALS.venues.festival_ground}
                alt="Ganesh Utsav in Mumbai"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-white">
                  🪔 Community
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-base font-serif font-bold text-white drop-shadow">
                  Ganesh Utsav in Mumbai
                </h3>
                <p className="text-[11px] text-white/80">Gokuldham Ground, Goregaon East</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-muted-foreground line-clamp-2">
                500 devotees • ₹2 Lakhs • Eco-friendly Clay murti, BMC/Police sound NOC & Mahaprasad feast.
              </p>
              <div className="flex items-center justify-between text-xs font-bold text-primary pt-2 border-t border-border/40">
                <span>Load Live Plan</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. EDITORIAL TESTIMONIAL (AuraWed High-End Card) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 shadow-md relative overflow-hidden text-center space-y-4">
          <div className="flex justify-center text-accent">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent" />
              ))}
            </div>
          </div>

          <p className="text-base sm:text-xl font-serif italic text-foreground leading-relaxed max-w-2xl mx-auto">
            “Working with EventCraft felt completely effortless. Every detail was intentional, culturally authentic to our family traditions, and kept us within our exact ₹15 Lakhs budget without a single surprise fee.”
          </p>

          <div className="pt-2">
            <h4 className="text-sm font-bold text-foreground">Diya & Aarav Parekh</h4>
            <p className="text-xs text-muted-foreground">Married at Regenta Resort, Bhuj</p>
          </div>
        </div>
      </div>

      {/* 5. FAQ ACCORDION (AuraWed Reference) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        <h3 className="text-lg font-serif font-bold text-foreground text-center mb-6">
          Frequently Asked Questions
        </h3>
        {faqs.map((faq, i) => {
          const isOpen = openFaq === i;
          return (
            <div key={i} className="border border-border rounded-2xl overflow-hidden bg-card">
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : i)}
                className="w-full p-4 text-left text-xs sm:text-sm font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted/40 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
