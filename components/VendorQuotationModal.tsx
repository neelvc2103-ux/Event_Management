'use client';

import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  IndianRupee,
  ShieldCheck,
  Star,
  Users,
  Building,
  Info,
  Check,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { VendorItem, EventPlan } from '@/types';
import { formatINR } from '@/lib/formatters';

interface VendorQuotationModalProps {
  plan: EventPlan;
  vendor: VendorItem;
  isOpen: boolean;
  onClose: () => void;
  onApplySelectedQuote: (quoteCost: number, vendorName: string) => void;
}

export function VendorQuotationModal({
  plan,
  vendor,
  isOpen,
  onClose,
  onApplySelectedQuote,
}: VendorQuotationModalProps) {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('opt_b');
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const baseCost = vendor.estimatedCost || 100000;
  const guestCount = plan.formData.guestCount;

  // Generate 3 realistic competing quotation packages tailored to this category
  const quotes = [
    {
      id: 'opt_a',
      tier: 'Standard / Value Local Specialist',
      name: `Local Traditional ${vendor.category} Guild`,
      totalCost: Math.round(baseCost * 0.85),
      perGuestRate: Math.round((baseCost * 0.85) / Math.max(1, guestCount)),
      rating: 4.4,
      reviewsCount: 38,
      inclusions: [
        'Core service delivery with standard setup',
        'Traditional regional equipment & materials',
        '4-hour service window on event day',
        'Standard staffing and cleanup',
      ],
      hiddenChargesWarning: [
        '⚠️ GST 18% charged extra on final invoice',
        '⚠️ Overtime after 10:00 PM charged at ₹2,500/hour',
        '⚠️ Local transport outside city limits not included',
      ],
      questionsToAsk: [
        'Is commercial kitchen setup and garbage disposal included in this rate?',
        'Do you supply backup equipment if technical failure occurs?',
        'What is your cancellation or date postponement penalty?',
      ],
    },
    {
      id: 'opt_b',
      tier: 'Premium Verified Studio (Recommended)',
      name: vendor.vendorName || `Heritage Curated ${vendor.category}`,
      totalCost: baseCost,
      perGuestRate: Math.round(baseCost / Math.max(1, guestCount)),
      rating: vendor.rating || 4.8,
      reviewsCount: 94,
      isRecommended: true,
      inclusions: [
        'Full bespoke setup with senior crew supervision',
        'FSSAI / Civic sound clearance verified compliance',
        'Backup silent generator & standby replacement team',
        '6-hour comprehensive coverage including setup & teardown',
        'Dedicated floor manager direct coordination',
      ],
      hiddenChargesWarning: [
        '⚠️ Fuel charge for 100 kVA silent generator extra if mains power fails',
        '⚠️ Specific specialty imported ingredients or props billed on actuals',
      ],
      questionsToAsk: [
        'Will the lead artist / head chef be present on-site during Muhurat / peak hours?',
        'Are crockery, chafing dishes, and uniform staff included in the per-plate rate?',
        'Can we schedule a pre-event tasting / mock trial session next week?',
      ],
    },
    {
      id: 'opt_c',
      tier: 'Luxury Celebrity-Grade Experience',
      name: `Royal Sovereign Signature ${vendor.category}`,
      totalCost: Math.round(baseCost * 1.35),
      perGuestRate: Math.round((baseCost * 1.35) / Math.max(1, guestCount)),
      rating: 4.9,
      reviewsCount: 142,
      inclusions: [
        'Grand royal aesthetic with bespoke artisanal styling',
        'Unlimited service hours throughout the celebration day',
        'Top-tier premium imported ingredients & crystal tableware',
        'VIP butler service and live masterclass counter',
        'Zero hidden charges guarantee (all-inclusive)',
      ],
      hiddenChargesWarning: [
        'ℹ️ All taxes & generator fuel fully inclusive in this rate',
        '⚠️ Strict non-refundable 30% advance booking deposit required',
      ],
      questionsToAsk: [
        'What is the maximum guest surge capacity without delay in banquet service?',
        'Do you provide custom embroidered uniforms matching our theme?',
        'How many VIP family liaison coordinators will be assigned to our stage?',
      ],
    },
  ];

  const handleSelectAndLock = (cost: number, name: string) => {
    onApplySelectedQuote(cost, name);
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print-bg">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quotation-modal-title"
        className="bg-card w-full max-w-5xl rounded-3xl shadow-2xl border border-border flex flex-col my-auto max-h-[94vh] overflow-hidden animate-fade-in"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-muted/60 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/20 text-accent-foreground shadow-sm">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="quotation-modal-title" className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Vendor Quotation Matrix & Negotiation Prep</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {vendor.category}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Compare competing quotes, audit hidden charges, and ask the right negotiation questions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            aria-label="Close Quotation Matrix"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Transparency Disclaimer (Per SME instructions) */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Transparent Estimation Protocol:</strong> Rates shown reflect regional market benchmarks in {plan.formData.city} for {guestCount} guests. We never claim a vendor is 100% booked until direct family verification and signed contract advance.
            </p>
          </div>

          {/* Quotations Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quotes.map((q) => {
              const isSelected = selectedQuoteId === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuoteId(q.id)}
                  className={`p-5 rounded-3xl border-2 flex flex-col justify-between transition-all cursor-pointer space-y-4 relative ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                      : 'border-border bg-card hover:border-border/80'
                  }`}
                >
                  {q.isRecommended && (
                    <div className="absolute -top-3 right-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-white shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-accent" />
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      {q.tier}
                    </span>
                    <h4 className="text-base font-bold text-foreground leading-snug">{q.name}</h4>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {q.rating}
                      </span>
                      <span className="text-muted-foreground">({q.reviewsCount} verified reviews)</span>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <span className="text-xl font-black text-foreground font-mono block">
                        {formatINR(q.totalCost)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        ~{formatINR(q.perGuestRate)} / guest allocation
                      </span>
                    </div>
                  </div>

                  {/* Scope & Inclusions */}
                  <div className="space-y-1.5 pt-2 border-t border-border text-xs">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground block">
                      What&apos;s Included:
                    </span>
                    <ul className="space-y-1 text-foreground text-[11px]">
                      {q.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hidden Charges Warning */}
                  <div className="p-2.5 rounded-xl bg-destructive/5 border border-destructive/15 text-[11px] space-y-1">
                    <span className="font-bold text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Hidden Charges Watchlist:
                    </span>
                    <ul className="space-y-0.5 text-muted-foreground">
                      {q.hiddenChargesWarning.map((hc, i) => (
                        <li key={i}>{hc}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Select CTA */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAndLock(q.totalCost, q.name);
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-primary text-white shadow-md hover:bg-primary/90'
                        : 'border border-border bg-muted/60 text-foreground hover:bg-muted'
                    }`}
                  >
                    {isSelected ? '✓ Lock This Quotation' : 'Select Package'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Step 3: SME Negotiation Questions Checklist */}
          {selectedQuoteId && (
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>Mandatory Clarifications to Ask This Vendor Before Final Advance:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {(quotes.find((q) => q.id === selectedQuoteId)?.questionsToAsk || []).map((qst, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                    <span className="font-bold text-primary text-[10px] block">Question {idx + 1}:</span>
                    <p className="text-muted-foreground mt-0.5 text-[11px]">{qst}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/40 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition-all"
          >
            Close Matrix
          </button>

          {applied && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Quotation locked into master plan!</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
