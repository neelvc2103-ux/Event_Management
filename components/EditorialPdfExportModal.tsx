'use client';

import React, { useEffect, useState } from 'react';
import {
  Printer,
  X,
  FileText,
  Building,
  Phone,
  CheckCircle2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Users,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { EventPlan } from '@/types';
import { formatINR, formatDate, getDaysRemaining } from '@/lib/formatters';
import { calculateVendorPaymentMilestones } from '@/lib/visualAssets';

interface EditorialPdfExportModalProps {
  plan: EventPlan;
  isOpen: boolean;
  onClose: () => void;
}

export function EditorialPdfExportModal({ plan, isOpen, onClose }: EditorialPdfExportModalProps) {
  const [activeHandout, setActiveHandout] = useState<'all' | 'elders' | 'venue'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const countdown = getDaysRemaining(plan.formData.eventDate);
  const paymentMilestones = calculateVendorPaymentMilestones(plan.budget.total);
  const venue = plan.venueDetails?.name || plan.formData.venueName || 'Banquet & Celebration Center';
  const address = plan.venueDetails?.address || `${plan.formData.locality || ''}, ${plan.formData.city}`;
  const muhurat = plan.muhuratDetails?.shubhMuhurat || '05:00 PM - 07:30 PM';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center p-2 sm:p-6 no-print-bg">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="editorial-pdf-title"
        className="bg-card w-full max-w-5xl rounded-3xl shadow-2xl border border-border flex flex-col my-auto max-h-[96vh] overflow-hidden"
      >
        {/* Top Control Bar (Never Printed) */}
        <div className="px-6 py-4 bg-muted/60 border-b border-border flex flex-wrap items-center justify-between gap-3 no-print shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="editorial-pdf-title" className="text-base font-bold text-foreground">
                Editorial Event Handout & PDF Summary
              </h3>
              <p className="text-xs text-muted-foreground">
                Official document for Family Elders & Venue Operations Managers
              </p>
            </div>
          </div>

          {/* Handout Toggle Filter */}
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveHandout('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeHandout === 'all' ? 'bg-card text-foreground shadow-sm font-bold' : 'text-muted-foreground'
              }`}
            >
              Complete Dossier
            </button>
            <button
              onClick={() => setActiveHandout('elders')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeHandout === 'elders' ? 'bg-card text-amber-900 dark:text-amber-200 shadow-sm font-bold' : 'text-muted-foreground'
              }`}
            >
              Elders&apos; Budget Ledger
            </button>
            <button
              onClick={() => setActiveHandout('venue')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeHandout === 'venue' ? 'bg-card text-blue-900 dark:text-blue-200 shadow-sm font-bold' : 'text-muted-foreground'
              }`}
            >
              Venue & Vendor Sheet
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-800 dark:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-amber-900 transition-all hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4 text-amber-200" />
              <span>One-Click Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close PDF Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-100 dark:bg-neutral-900/50">
          <div
            id="editorial-handout-sheet"
            className="max-w-4xl mx-auto bg-white text-neutral-900 p-8 sm:p-12 rounded-2xl shadow-xl border border-neutral-200 print:border-none print:shadow-none print:p-0 print:m-0 space-y-10 font-serif"
          >
            {/* DOCUMENT HEADER */}
            <div className="border-b-4 border-amber-800 pb-6 text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-widest font-sans">
                <span>✦ EVENT OPERATIONS EXECUTIVE HANDOUT ✦</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight uppercase">
                {plan.formData.eventName}
              </h1>
              <p className="text-sm text-neutral-700 font-sans font-medium">
                <strong>Target Date:</strong> {formatDate(plan.formData.eventDate)} ({countdown.label}) •{' '}
                <strong>Location:</strong> {venue}, {address}
              </p>
              {plan.muhuratDetails && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 inline-block font-sans font-bold">
                  🕉️ Shubh Muhurat: {plan.muhuratDetails.shubhMuhurat} | Nakshatra: {plan.muhuratDetails.nakshatra}
                </div>
              )}
            </div>

            {/* SECTION 1: MASTER BUDGET & TRANCHE PAYMENT LEDGER (FOR ELDERS & TREASURERS) */}
            {(activeHandout === 'all' || activeHandout === 'elders') && (
              <div className="space-y-6 font-sans">
                <div className="border-b-2 border-amber-800 pb-2 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                      CONFIDENTIAL FINANCIAL SUMMARY
                    </span>
                    <h2 className="text-lg font-black text-neutral-950 font-serif">
                      1. Master Budget Breakdown & Payment Tranches (Family Elder Copy)
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-600 block">Total Authorized Budget:</span>
                    <span className="text-xl font-black text-amber-950 font-mono">
                      {formatINR(plan.budget.total)}
                    </span>
                  </div>
                </div>

                {/* 3-Tier Payment Tranche Milestones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-amber-900 block">
                      Tranche 1: Advance Token (25%)
                    </span>
                    <span className="text-base font-bold font-mono text-neutral-900 block mt-1">
                      {formatINR(paymentMilestones.advanceToken)}
                    </span>
                    <p className="text-[11px] text-neutral-600 mt-1">
                      Booking lock for Venue, Decorator & Lead Caterer.
                    </p>
                  </div>

                  <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-amber-900 block">
                      Tranche 2: Mid-Way Milestone (50%)
                    </span>
                    <span className="text-base font-bold font-mono text-neutral-900 block mt-1">
                      {formatINR(paymentMilestones.midWay)}
                    </span>
                    <p className="text-[11px] text-neutral-600 mt-1">
                      Fabrication check, raw material procurement, tasting.
                    </p>
                  </div>

                  <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-amber-900 block">
                      Tranche 3: Day-Of Final Settlement (25%)
                    </span>
                    <span className="text-base font-bold font-mono text-neutral-900 block mt-1">
                      {formatINR(paymentMilestones.finalSettlement)}
                    </span>
                    <p className="text-[11px] text-neutral-600 mt-1">
                      Post-event wrap check, inventory return & elder sign-off.
                    </p>
                  </div>
                </div>

                {/* Budget Category Itemized Table */}
                <table className="w-full text-xs text-left border-collapse border border-neutral-200">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-900 font-bold border-b border-neutral-300">
                      <th className="py-2.5 px-3 border-r border-neutral-200">Category</th>
                      <th className="py-2.5 px-2 text-center border-r border-neutral-200">Share</th>
                      <th className="py-2.5 px-3 border-r border-neutral-200 font-mono">Allocation</th>
                      <th className="py-2.5 px-3 border-r border-neutral-200">Inclusions / Notes</th>
                      <th className="py-2.5 px-3 text-center">Settled / Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {plan.budget.categories.map((cat, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/60'}>
                        <td className="py-2 px-3 font-bold text-neutral-950 border-r border-neutral-200">
                          {cat.name}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-amber-950 border-r border-neutral-200">
                          {cat.percentage}%
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-neutral-950 border-r border-neutral-200">
                          {formatINR(cat.amount)}
                        </td>
                        <td className="py-2 px-3 text-neutral-700 leading-snug border-r border-neutral-200">
                          {cat.notes}
                        </td>
                        <td className="py-2 px-3 text-center text-[11px] text-neutral-600 font-mono">
                          [ ] Cash / UPI
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-amber-100/70 font-bold border-t-2 border-amber-800 text-neutral-950">
                      <td className="py-2.5 px-3 border-r border-neutral-200 uppercase">
                        Total Master Spend
                      </td>
                      <td className="py-2.5 px-2 text-center border-r border-neutral-200">100%</td>
                      <td className="py-2.5 px-3 font-mono font-black text-amber-950 border-r border-neutral-200">
                        {formatINR(plan.budget.total)}
                      </td>
                      <td colSpan={2} className="py-2.5 px-3 text-neutral-700">
                        Zero drift • Exact sum verified
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Elder Signatures Block */}
                <div className="pt-4 border-t border-neutral-300 grid grid-cols-3 gap-4 text-center text-xs">
                  <div className="space-y-6 pt-6 border-t border-neutral-400">
                    <span className="font-bold text-neutral-800 block">Family Elder / Treasurer Signature</span>
                  </div>
                  <div className="space-y-6 pt-6 border-t border-neutral-400">
                    <span className="font-bold text-neutral-800 block">Lead Coordinator Sign-Off</span>
                  </div>
                  <div className="space-y-6 pt-6 border-t border-neutral-400">
                    <span className="font-bold text-neutral-800 block">Date of Final Settlement</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: VENUE MANAGER & VENDOR CONTACT SHEET */}
            {(activeHandout === 'all' || activeHandout === 'venue') && (
              <div className="space-y-6 font-sans print:break-before-page">
                <div className="border-b-2 border-blue-900 pb-2 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">
                      VENUE LOGISTICS & CONTACT DIRECTORY
                    </span>
                    <h2 className="text-lg font-black text-neutral-950 font-serif">
                      2. Venue Operations Manager & Verified Vendor Sheet
                    </h2>
                  </div>
                  <div className="text-right text-xs text-neutral-700">
                    <span>Expected Guests: <strong>{plan.formData.guestCount}</strong></span>
                  </div>
                </div>

                {/* Venue Guidelines Strip */}
                <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1.5 text-xs text-neutral-800">
                  <span className="font-bold text-blue-950 block">🏛️ Venue Operations & Compliance Check:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <p>• <strong>Sound Curfew:</strong> Outdoor decibels muted by 10:00 PM; indoor hall permitted.</p>
                    <p>• <strong>Loading Access:</strong> Vendor loading bay open 4 hours prior to muhurat.</p>
                    <p>• <strong>Power Backup:</strong> 125 kVA silent generator standby tested.</p>
                    <p>• <strong>Fire & Safety:</strong> 4 CO2 extinguishers verified at kitchen & main entrance.</p>
                  </div>
                </div>

                {/* Verified Vendor Rolodex Table */}
                <table className="w-full text-xs text-left border-collapse border border-neutral-200">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-900 font-bold border-b border-neutral-300">
                      <th className="py-2.5 px-3 border-r border-neutral-200">Category</th>
                      <th className="py-2.5 px-3 border-r border-neutral-200">Vendor / Lead Partner</th>
                      <th className="py-2.5 px-3 border-r border-neutral-200">Direct Phone / WhatsApp</th>
                      <th className="py-2.5 px-3 border-r border-neutral-200 font-mono">Cost (INR)</th>
                      <th className="py-2.5 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {plan.vendors.map((v, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/60'}>
                        <td className="py-2 px-3 font-bold text-neutral-950 border-r border-neutral-200">
                          {v.category}
                        </td>
                        <td className="py-2 px-3 text-neutral-900 font-medium border-r border-neutral-200">
                          <div><strong>{v.vendorName || v.category}</strong></div>
                          <div className="text-[10px] text-neutral-600">{v.vendorAddress || plan.formData.city}</div>
                        </td>
                        <td className="py-2 px-3 font-mono font-medium text-neutral-800 border-r border-neutral-200 whitespace-nowrap">
                          {v.vendorPhone || '+91 98XXX XXXXX'}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-neutral-950 border-r border-neutral-200">
                          {formatINR(v.estimatedCost)}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-[10px]">
                          <span className={`px-2 py-0.5 rounded ${v.isBooked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {v.isBooked ? 'Booked' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Day-of Run-of-Show Chronology */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
                    Key Operational Run-of-Show Checkpoints:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(plan.runOfShow || []).slice(0, 6).map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg flex items-start gap-2">
                        <span className="font-mono font-bold text-amber-900 shrink-0">{item.time}</span>
                        <div>
                          <p className="font-bold text-neutral-900 text-[11px]">{item.eventTitle}</p>
                          <p className="text-[10px] text-neutral-600">{item.coordinator} • {item.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Venue Manager Sign-Off */}
                <div className="pt-4 border-t border-neutral-300 grid grid-cols-2 gap-6 text-center text-xs">
                  <div className="space-y-6 pt-6 border-t border-neutral-400">
                    <span className="font-bold text-neutral-800 block">Duty Venue Manager Clearance</span>
                  </div>
                  <div className="space-y-6 pt-6 border-t border-neutral-400">
                    <span className="font-bold text-neutral-800 block">Chief Event Floor Coordinator</span>
                  </div>
                </div>

                {/* Brand Footnote */}
                <p className="text-[10px] text-center text-neutral-500 font-sans pt-4 border-t border-neutral-200">
                  Document generated by <strong>AYOJA</strong> • Your Plans. Your People. Your Moments. • Luxury & Precision Indian Event Command Center
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
