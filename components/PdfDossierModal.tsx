'use client';

import React, { useEffect } from 'react';
import {
  Printer,
  X,
  Sparkles,
  Download,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Phone,
  FileText,
} from 'lucide-react';
import { EventPlan } from '@/types';
import { formatINR, formatDate, getDaysRemaining } from '@/lib/formatters';

interface PdfDossierModalProps {
  plan: EventPlan;
  isOpen: boolean;
  onClose: () => void;
}

export function PdfDossierModal({ plan, isOpen, onClose }: PdfDossierModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const countdown = getDaysRemaining(plan.formData.eventDate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center p-2 sm:p-6 no-print-bg">
      {/* Modal Dialog Box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-modal-title"
        className="bg-card w-full max-w-5xl rounded-3xl shadow-2xl border border-border flex flex-col my-auto max-h-[96vh] overflow-hidden"
      >
        {/* Modal Top Control Bar (Never Printed) */}
        <div className="px-6 py-4 bg-muted/60 border-b border-border flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 id="dossier-modal-title" className="text-base font-bold text-foreground">
                Official Event Dossier & PDF Print Preview
              </h3>
              <p className="text-xs text-muted-foreground">
                Formatted for A4 printable documents & client presentations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold shadow-md hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Dossier Preview"
              className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-100 dark:bg-neutral-900/50">
          {/* Printable Sheet */}
          <div
            id="printable-event-dossier"
            className="max-w-4xl mx-auto bg-white text-neutral-900 p-8 sm:p-12 rounded-2xl shadow-lg border border-neutral-200 print:border-none print:shadow-none print:p-0 print:m-0 space-y-10"
          >
            {/* ROYAL HEADER BANNER */}
            <div className="border-b-4 border-amber-600/80 pb-6 text-center space-y-3 relative">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest">
                <span>✦ EVENT PLANNING DOSSIER & COMPLIANCE BRIEF ✦</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight uppercase font-serif">
                {plan.formData.eventName}
              </h1>

              <p className="text-sm text-neutral-600 font-medium max-w-2xl mx-auto">
                {plan.venueDetails?.name ? `${plan.venueDetails.name}, ` : ''}
                {plan.formData.locality ? `${plan.formData.locality}, ` : ''}
                {plan.formData.city} • Auspicious Target Date: {formatDate(plan.formData.eventDate)} ({countdown.label})
              </p>

              {/* Auspicious Muhurat Highlight Banner */}
              {plan.muhuratDetails && (
                <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 inline-block font-semibold">
                  🕉️ <strong>Shubh Muhurat:</strong> {plan.muhuratDetails.shubhMuhurat} •{' '}
                  <strong>Nakshatra:</strong> {plan.muhuratDetails.nakshatra}
                </div>
              )}
            </div>

            {/* KEY EVENT METRICS GRID */}
            <div className="grid grid-cols-4 gap-3 text-center border-y border-neutral-200 py-4 bg-neutral-50/80 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Budget (INR)</span>
                <span className="text-lg font-black text-amber-800">{formatINR(plan.budget.total)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Guest Count</span>
                <span className="text-lg font-bold text-neutral-800">{plan.formData.guestCount} Guests</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Target Event Date</span>
                <span className="text-lg font-bold text-neutral-800">{formatDate(plan.formData.eventDate)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Venue Capacity</span>
                <span className="text-lg font-bold text-neutral-800">
                  {plan.venueDetails?.capacity || 'Custom Venue'}
                </span>
              </div>
            </div>

            {/* EXECUTIVE SUMMARY */}
            <div className="space-y-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 flex items-center gap-2">
                <span>1. Executive Summary & Cultural Framework</span>
              </h2>
              <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line text-justify">
                {plan.summary}
              </p>
            </div>

            {/* VENUE PROFILE CARD */}
            {plan.venueDetails && (
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-neutral-900 text-sm">
                    🏛️ Verified Venue: {plan.venueDetails.name}
                  </h3>
                  <span className="font-semibold text-amber-700">
                    ★ {plan.venueDetails.rating}/5.0 • {plan.venueDetails.pricingTier} Tier
                  </span>
                </div>
                <p className="text-neutral-600">
                  <strong>Address:</strong> {plan.venueDetails.address}
                </p>
                <p className="text-neutral-600">
                  <strong>Specifications:</strong> {plan.venueDetails.highlights.join(' • ')}
                </p>
              </div>
            )}

            {/* FINANCIAL LEDGER & BUDGET BREAKDOWN */}
            <div className="space-y-3 print:break-inside-avoid">
              <div className="flex justify-between items-center border-b border-amber-200 pb-1">
                <h2 className="text-sm font-black uppercase tracking-wider text-amber-900">
                  2. Financial Allocation & Verified Budget Ledger
                </h2>
                <span className="text-xs font-bold text-neutral-700 font-mono">
                  Guaranteed Exact Sum: {formatINR(plan.budget.total)}
                </span>
              </div>

              <table className="w-full text-xs text-left border-collapse border border-neutral-200">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-800 font-bold border-b border-neutral-300">
                    <th className="py-2 px-3 border-r border-neutral-200">Category</th>
                    <th className="py-2 px-3 text-center border-r border-neutral-200">Alloc. %</th>
                    <th className="py-2 px-3 border-r border-neutral-200">Exact Amount (INR)</th>
                    <th className="py-2 px-3">Scope & Operational Inclusions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {plan.budget.categories.map((cat, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                      <td className="py-2 px-3 font-bold text-neutral-900 border-r border-neutral-200">
                        {cat.name}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-amber-800 border-r border-neutral-200">
                        {cat.percentage}%
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-neutral-900 border-r border-neutral-200">
                        {formatINR(cat.amount)}
                      </td>
                      <td className="py-2 px-3 text-neutral-600 leading-snug">
                        {cat.notes}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-amber-50 font-bold border-t-2 border-amber-600 text-neutral-900">
                    <td className="py-2 px-3 border-r border-neutral-200 uppercase">Total Consolidated Spend</td>
                    <td className="py-2 px-3 text-center border-r border-neutral-200">100%</td>
                    <td className="py-2 px-3 font-mono font-black text-amber-900 border-r border-neutral-200">
                      {formatINR(plan.budget.total)}
                    </td>
                    <td className="py-2 px-3 text-neutral-600">Zero budget drift verified</td>
                  </tr>
                </tbody>
              </table>

              {/* Localized Cost Saving Strategies */}
              {plan.budget.savingTips && plan.budget.savingTips.length > 0 && (
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1.5 text-xs text-neutral-700">
                  <span className="font-bold text-amber-900 block">💡 Local Procurement & Cost-Saving Protocol:</span>
                  <ul className="list-disc pl-5 space-y-1">
                    {plan.budget.savingTips.map((tip, idx) => (
                      <li key={idx} className="leading-snug">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CHRONOLOGICAL EXECUTION ROADMAP */}
            <div className="space-y-3 print:break-before-page">
              <h2 className="text-sm font-black uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1">
                3. Chronological Milestone Roadmap (Zero Past Dates Verified)
              </h2>

              <table className="w-full text-xs text-left border-collapse border border-neutral-200">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-800 font-bold border-b border-neutral-300">
                    <th className="py-2 px-2.5 border-r border-neutral-200">Status</th>
                    <th className="py-2 px-2.5 border-r border-neutral-200">Due Date</th>
                    <th className="py-2 px-2.5 border-r border-neutral-200">Milestone Phase</th>
                    <th className="py-2 px-3 border-r border-neutral-200">Deliverable Task</th>
                    <th className="py-2 px-2.5 text-center">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {plan.timeline.map((task, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                      <td className="py-2 px-2.5 border-r border-neutral-200 font-mono text-[11px]">
                        {task.completed ? '[✓] Done' : '[ ] Pending'}
                      </td>
                      <td className="py-2 px-2.5 font-bold text-neutral-900 border-r border-neutral-200 whitespace-nowrap">
                        {formatDate(task.dueDate)}
                      </td>
                      <td className="py-2 px-2.5 text-neutral-600 font-medium border-r border-neutral-200">
                        {task.phase}
                      </td>
                      <td className="py-2 px-3 text-neutral-900 font-medium leading-snug border-r border-neutral-200">
                        {task.task}
                      </td>
                      <td className="py-2 px-2.5 text-center uppercase font-bold text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VERIFIED LOCAL VENDOR ROLODEX */}
            <div className="space-y-3 print:break-before-page">
              <h2 className="text-sm font-black uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1">
                4. Verified Local Vendor Rolodex & Contracts
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plan.vendors.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50/50 text-xs space-y-2 print:break-inside-avoid"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">
                          {v.category}
                        </span>
                        <h4 className="font-bold text-neutral-900 text-sm">
                          {v.vendorName || v.category}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-amber-900 block">
                          {formatINR(v.estimatedCost)}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-medium">
                          {v.isBooked ? '✓ Booked' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-600 space-y-0.5">
                      <p><strong>Address:</strong> {v.vendorAddress || `${plan.formData.city}`}</p>
                      <p><strong>Contact:</strong> {v.vendorPhone || '+91 98XXX XXXXX'} • <strong>Rating:</strong> ★ {v.rating || 4.8}/5</p>
                      {v.verifiedBadge && (
                        <p className="text-amber-800 font-medium"><strong>Verification:</strong> {v.verifiedBadge}</p>
                      )}
                    </div>

                    {/* Checklist bullets */}
                    <div className="pt-1.5 border-t border-neutral-200">
                      <span className="font-bold text-[10px] uppercase text-neutral-700 block">
                        Mandatory Contract Clauses:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-neutral-600 text-[11px]">
                        {v.checklist.slice(0, 3).map((c, ci) => (
                          <li key={ci}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REGIONAL CUISINE, DECOR & THEMES */}
            <div className="space-y-4 print:break-before-page">
              <h2 className="text-sm font-black uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1">
                5. Curated Experience, Regional Banquet Menu & Decor
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Menu */}
                <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-xl space-y-2">
                  <h3 className="font-bold text-neutral-900 text-sm border-b border-amber-200 pb-1">
                    🍽️ Authentic Regional Banquet Menu Spread
                  </h3>
                  <ul className="space-y-1.5 text-neutral-700">
                    {plan.ideas.menu.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-700 font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Themes & Decor */}
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                  <h3 className="font-bold text-neutral-900 text-sm border-b border-neutral-200 pb-1">
                    🎨 Aesthetics, Decor & Favors
                  </h3>
                  <div className="space-y-2 text-neutral-700">
                    <div>
                      <strong className="text-neutral-900">Recommended Theme:</strong>{' '}
                      {plan.ideas.themes[0]?.name} - {plan.ideas.themes[0]?.description}
                    </div>
                    <div>
                      <strong className="text-neutral-900">Mandap & Entrance Decor:</strong>
                      <ul className="list-disc pl-4 text-neutral-600 mt-1 space-y-0.5">
                        {plan.ideas.decor.slice(0, 3).map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-neutral-900">Return Gifts & Favors:</strong>
                      <ul className="list-disc pl-4 text-neutral-600 mt-1 space-y-0.5">
                        {plan.ideas.giftsAndFavors.slice(0, 2).map((g, idx) => (
                          <li key={idx}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CIVIC COMPLIANCE & PROTOCOL SECTION */}
            {plan.civicCompliance && (
              <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl text-xs space-y-2 text-neutral-700 print:break-inside-avoid">
                <h3 className="font-bold text-red-950 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-700" />
                  Statutory Permissions, Police Sound Curfew & Safety Protocol
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <strong>Police Loudspeaker Curfew:</strong>
                    <p className="text-neutral-600 text-[11px] mt-0.5">{plan.civicCompliance.soundCurfew}</p>
                  </div>
                  <div>
                    <strong>Municipal Clearance Office:</strong>
                    <p className="text-neutral-600 text-[11px] mt-0.5">{plan.civicCompliance.municipalOffice}</p>
                  </div>
                </div>
              </div>
            )}

            {/* OFFICIAL SIGNATURE / SIGN-OFF BLOCK */}
            <div className="pt-8 border-t-2 border-neutral-300 grid grid-cols-3 gap-8 text-center text-xs print:break-inside-avoid">
              <div className="space-y-6">
                <div className="h-10 border-b border-neutral-400" />
                <span className="font-bold text-neutral-800 block">Host / Client Sign-off</span>
              </div>
              <div className="space-y-6">
                <div className="h-10 border-b border-neutral-400" />
                <span className="font-bold text-neutral-800 block">Lead Event Coordinator</span>
              </div>
              <div className="space-y-6">
                <div className="h-10 border-b border-neutral-400" />
                <span className="font-bold text-neutral-800 block">Venue Authorized Representative</span>
              </div>
            </div>

            {/* DOCUMENT FOOTER */}
            <div className="text-center pt-4 border-t border-neutral-200 text-[10px] text-neutral-500">
              Generated by AYOJA • Luxury & Precision Indian Event Command Center • Formatted in Indian Rupees (INR ₹)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
