'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Share2,
  Check,
  UserCheck,
  QrCode,
  Ticket,
} from 'lucide-react';
import { EventPlan } from '@/types';
import { formatDate } from '@/lib/formatters';

interface DigitalPassModalProps {
  plan: EventPlan;
  isOpen: boolean;
  onClose: () => void;
}

export function DigitalPassModal({ plan, isOpen, onClose }: DigitalPassModalProps) {
  const [passHolder, setPassHolder] = useState('Family Host - All Access VIP');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const eventTitle = plan.formData.eventName;
  const venueName = plan.venueDetails?.name || plan.formData.venueName || 'Grand Celebration Venue';
  const venueAddress = plan.venueDetails?.address || `${plan.formData.locality || ''}, ${plan.formData.city}`;
  const dateFormatted = formatDate(plan.formData.eventDate);
  const muhurat = plan.muhuratDetails?.shubhMuhurat || '04:30 PM - 07:00 PM';

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `🎫 *Digital VIP Pass: ${eventTitle}*\n📍 ${venueName}\n📅 ${dateFormatted}\n⏰ Muhurat / Time: ${muhurat}\nPass Holder: ${passHolder}\n\nPresent this digital pass at the entrance gate.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print-bg">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pass-modal-title"
        className="bg-card w-full max-w-xl rounded-3xl shadow-2xl border border-border flex flex-col my-auto overflow-hidden animate-fade-in"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-muted/60 border-b border-border flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-accent/20 text-accent-foreground">
              <Ticket className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 id="pass-modal-title" className="text-sm font-bold text-foreground">
                Digital Event Pass & Gate QR
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Official Access Credential for Family & Guests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Print Pass"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              aria-label="Close pass modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pass Role Selector (No print) */}
        <div className="px-6 pt-4 pb-2 border-b border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-2 no-print">
          <label htmlFor="passHolderSelect" className="text-xs font-semibold text-muted-foreground">Pass Tier:</label>
          <select
            id="passHolderSelect"
            value={passHolder}
            onChange={(e) => setPassHolder(e.target.value)}
            className="text-xs font-bold py-1.5 px-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="Family Host - All Access VIP">Family Host - All Access VIP</option>
            <option value="Bride & Groom Family Circle">Bride & Groom Family Circle</option>
            <option value="Guest Pass - Reserved Seating">Guest Pass - Reserved Seating</option>
            <option value="Vendor & Logistics Access">Vendor & Logistics Access</option>
          </select>
        </div>

        {/* Printable Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="relative rounded-3xl border-2 border-accent/40 bg-gradient-to-br from-card via-card to-accent/5 p-6 sm:p-8 shadow-lg overflow-hidden">
            {/* Watermark accent */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-marigold-500" />

            {/* Event Name & Category */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-3 h-3 text-accent" />
                  {plan.formData.eventType === 'wedding'
                    ? 'Big Fat Indian Wedding'
                    : plan.formData.eventType === 'birthday'
                    ? 'Birthday Celebration'
                    : 'Grand Community Festival'}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-foreground mt-2 tracking-tight leading-snug">
                  {eventTitle}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Pass Type: <span className="font-bold text-accent-foreground">{passHolder}</span>
                </p>
              </div>

              {/* QR Code Container */}
              <div className="shrink-0 flex flex-col items-center p-2.5 rounded-2xl bg-white border border-border shadow-sm text-center">
                {/* SVG Simulated high-res QR code */}
                <svg className="w-20 h-20 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="28" height="28" rx="4" />
                  <rect x="11" y="11" width="16" height="16" fill="white" />
                  <rect x="15" y="15" width="8" height="8" />

                  <rect x="67" y="5" width="28" height="28" rx="4" />
                  <rect x="73" y="11" width="16" height="16" fill="white" />
                  <rect x="77" y="15" width="8" height="8" />

                  <rect x="5" y="67" width="28" height="28" rx="4" />
                  <rect x="11" y="73" width="16" height="16" fill="white" />
                  <rect x="15" y="77" width="8" height="8" />

                  {/* Interior data matrix pattern */}
                  <rect x="40" y="8" width="8" height="8" />
                  <rect x="52" y="8" width="6" height="12" />
                  <rect x="40" y="24" width="12" height="6" />
                  <rect x="20" y="42" width="8" height="8" />
                  <rect x="34" y="40" width="10" height="10" />
                  <rect x="50" y="42" width="14" height="8" />
                  <rect x="70" y="40" width="8" height="16" />
                  <rect x="84" y="42" width="10" height="8" />
                  <rect x="40" y="58" width="18" height="8" />
                  <rect x="40" y="72" width="8" height="14" />
                  <rect x="54" y="76" width="12" height="8" />
                  <rect x="72" y="66" width="14" height="10" />
                  <rect x="72" y="82" width="20" height="8" />
                </svg>
                <span className="text-[9px] font-mono font-bold text-slate-600 mt-1 uppercase">
                  EC-{plan.id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Event Specific Logistics Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-dashed border-border/80 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-primary" />
                  Event Date
                </span>
                <p className="font-bold text-foreground text-sm">{dateFormatted}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent" />
                  Ceremony / Muhurat
                </span>
                <p className="font-bold text-foreground text-sm">{muhurat}</p>
              </div>

              <div className="col-span-2 space-y-1 pt-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  Venue Location
                </span>
                <p className="font-bold text-foreground leading-snug">{venueName}</p>
                <p className="text-[11px] text-muted-foreground leading-snug">{venueAddress}</p>
              </div>
            </div>

            {/* Footer Bar of Pass */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified by EventCraft System</span>
              </div>
              <span className="font-medium">Curfew Advisory: 10:00 PM</span>
            </div>
          </div>

          {/* Quick Share Actions (No print) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 no-print">
            <button
              onClick={handleShare}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied Pass Info!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-primary" />
                  <span>Copy Digital Pass Text</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-all"
            >
              <Printer className="w-4 h-4 text-accent" />
              <span>Print Official Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

