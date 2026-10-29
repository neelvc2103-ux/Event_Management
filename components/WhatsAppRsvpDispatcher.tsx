'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  MessageCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  Users,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  ExternalLink,
  Crown,
  HeartHandshake,
} from 'lucide-react';
import { EventPlan } from '@/types';
import { generateWhatsAppInviteCopy, WhatsAppInviteOptions } from '@/lib/shareUtils';
import { formatDate } from '@/lib/formatters';

interface WhatsAppRsvpDispatcherProps {
  plan: EventPlan;
  isOpen: boolean;
  onClose: () => void;
  onOpenPassModal?: () => void;
}

export function WhatsAppRsvpDispatcher({
  plan,
  isOpen,
  onClose,
  onOpenPassModal,
}: WhatsAppRsvpDispatcherProps) {
  const [segment, setSegment] = useState<'vip' | 'general' | 'out_of_town' | 'vendor'>('vip');
  const [guestName, setGuestName] = useState('Sharma Family');
  const [guestCount, setGuestCount] = useState(4);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const inviteData = useMemo(() => {
    return generateWhatsAppInviteCopy({
      plan,
      guestName: guestName.trim() || 'Respected Guest',
      guestCount,
      segment,
    });
  }, [plan, guestName, guestCount, segment]);

  if (!isOpen) return null;

  const handleCopyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteData.text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const handleCopyPassLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const passLink = `${origin}/?view=pass&planId=${plan.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(passLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleOpenWhatsApp = () => {
    window.open(inviteData.waLink, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print-bg">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wa-dispatcher-title"
        className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border flex flex-col my-auto overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-600/10 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="wa-dispatcher-title" className="text-base font-bold text-foreground flex items-center gap-2">
                <span>WhatsApp RSVP & Digital Pass Dispatcher</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 border border-emerald-600/30">
                  Direct Integration
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Generate pre-filled personalized invite messages with embedded digital passes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            aria-label="Close WhatsApp Dispatcher"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Guest Segment Tier Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Guest Access Tier & Tone:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSegment('vip')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  segment === 'vip'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-sm ring-2 ring-amber-500/20'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>VIP Family</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Full ceremonial access & royal banquet
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSegment('general')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  segment === 'general'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Friends & Gen</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Evening celebration, dinner & photo-op
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSegment('out_of_town')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  segment === 'out_of_town'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-900 dark:text-blue-200 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>Out-of-Town</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Hotel, airport shuttle & stay info
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSegment('vendor')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  segment === 'vendor'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-900 dark:text-purple-200 shadow-sm ring-2 ring-purple-500/20'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span>Vendors/Crew</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Loading gate, sound call & curfew
                </p>
              </button>
            </div>
          </div>

          {/* Guest Personalization Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="guestNameInput" className="text-xs font-semibold text-muted-foreground">Guest or Family Name:</label>
              <input
                id="guestNameInput"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Uncle Rajesh & Family"
                className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="guestCountInput" className="text-xs font-semibold text-muted-foreground">Reserved Seat / Pass Count:</label>
              <input
                id="guestCountInput"
                type="number"
                min={1}
                max={20}
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* WhatsApp Chat Preview Simulation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live WhatsApp Message Preview:
              </span>
              {onOpenPassModal && (
                <button
                  type="button"
                  onClick={onOpenPassModal}
                  className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Preview Pass & Badge Card</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 dark:bg-emerald-950/40 border border-emerald-500/30">
              <div className="max-w-md ml-auto bg-[#dcf8c6] dark:bg-emerald-900/80 text-neutral-900 dark:text-neutral-100 p-4 rounded-2xl rounded-tr-none shadow-sm space-y-2 text-xs font-sans whitespace-pre-line leading-relaxed">
                {inviteData.text}
                <div className="text-right text-[10px] text-neutral-500 dark:text-neutral-400 font-mono mt-1 flex items-center justify-end gap-1">
                  <span>12:00 PM</span>
                  <span>✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-muted/40 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copied Message!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Copy Message</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyPassLink}
              className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copied Pass Link!</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Copy Pass Link</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-emerald-500 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Send on WhatsApp Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
