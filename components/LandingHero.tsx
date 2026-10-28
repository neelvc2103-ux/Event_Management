'use client';

import React from 'react';
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
} from 'lucide-react';
import { SAMPLE_INPUTS } from '@/lib/storage';
import { EventFormData } from '@/types';

interface LandingHeroProps {
  onStartPlanning: () => void;
  onSelectSample: (sampleKey: keyof typeof SAMPLE_INPUTS) => void;
}

export function LandingHero({ onStartPlanning, onSelectSample }: LandingHeroProps) {
  return (
    <div className="relative overflow-hidden py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent-foreground text-xs sm:text-sm font-semibold mb-6 shadow-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>India-First GenAI Event Planner</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
          Craft unforgettable{' '}
          <span className="bg-gradient-to-r from-primary via-maroon-700 to-accent bg-clip-text text-transparent">
            Weddings, Birthdays & Festivals
          </span>{' '}
          in minutes.
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          From Gujarati lagna rituals in Bhuj to Mumbai society Ganesh pandals and vibrant kids’ birthdays. Get complete budgets in INR, backward-calculated timelines, vendor checklists, and bespoke menus.
        </p>

        {/* Primary CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartPlanning}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-maroon-800 text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 text-accent" />
            <span>Plan My Event Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sample Templates Section */}
        <div className="mt-14 pt-10 border-t border-border/60">
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
            Or load an authentic sample Indian event instantly:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-5xl mx-auto">
            {/* Sample 1: Wedding */}
            <button
              type="button"
              onClick={() => onSelectSample('gujarati_wedding')}
              className="group p-5 rounded-2xl border border-border bg-card/70 hover:bg-card hover:border-primary/50 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-maroon-500/5 rounded-full blur-2xl group-hover:bg-maroon-500/10 transition-all" />
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-maroon-500/10 text-primary">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Wedding</span>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Gujarati Wedding in Bhuj
                  </h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                350 guests • ₹15 Lakhs • Lagna muhurat, Jain bhojan, Dhol-Tasha & royal mandap setup.
              </p>
              <div className="mt-3.5 flex items-center justify-between text-xs font-semibold text-primary pt-2 border-t border-border/40">
                <span>Load Sample Plan</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Sample 2: Birthday */}
            <button
              type="button"
              onClick={() => onSelectSample('kids_birthday')}
              className="group p-5 rounded-2xl border border-border bg-card/70 hover:bg-card hover:border-accent/50 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all" />
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10 text-accent-foreground">
                  <Cake className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">Birthday</span>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-accent-foreground transition-colors">
                    Kid’s 5th Birthday in Pune
                  </h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                40 kids & parents • ₹30,000 • Jungle Safari theme, balloon arch, magic show & return gifts.
              </p>
              <div className="mt-3.5 flex items-center justify-between text-xs font-semibold text-accent-foreground pt-2 border-t border-border/40">
                <span>Load Sample Plan</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Sample 3: Community Event */}
            <button
              type="button"
              onClick={() => onSelectSample('ganesh_utsav')}
              className="group p-5 rounded-2xl border border-border bg-card/70 hover:bg-card hover:border-primary/50 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Community</span>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Ganesh Utsav in Mumbai
                  </h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                500 devotees • ₹2 Lakhs • Eco-friendly Clay murti, BMC/Police sound NOC & Mahaprasad.
              </p>
              <div className="mt-3.5 flex items-center justify-between text-xs font-semibold text-primary pt-2 border-t border-border/40">
                <span>Load Sample Plan</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-xl border border-border/60 bg-card/40">
            <PieChart className="w-5 h-5 text-primary mb-2" />
            <h4 className="text-xs sm:text-sm font-bold text-foreground">Live Budget Donut</h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
              Auto-rebalances every rupee so category edits never exceed your budget.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card/40">
            <CalendarCheck className="w-5 h-5 text-accent mb-2" />
            <h4 className="text-xs sm:text-sm font-bold text-foreground">Zero-Past Timelines</h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
              Backward calculated from event date; auto-compresses for urgent dates.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card/40">
            <ShieldCheck className="w-5 h-5 text-primary mb-2" />
            <h4 className="text-xs sm:text-sm font-bold text-foreground">India-First Checklists</h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
              Panditji rites, Halwai food safety, police sound curfews & society NOCs.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card/40">
            <IndianRupee className="w-5 h-5 text-accent mb-2" />
            <h4 className="text-xs sm:text-sm font-bold text-foreground">Printable PDF & Share</h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
              Export clean formatted PDFs or copy WhatsApp summaries for family & committee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
