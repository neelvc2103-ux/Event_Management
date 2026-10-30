'use client';

import React, { useState, useMemo } from 'react';
import {
  Store,
  CheckCircle2,
  Circle,
  HelpCircle,
  Check,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Calendar,
  Utensils,
  Camera,
  Music,
  Building,
  Sparkles,
  Palette,
  Truck,
  Gift,
  Scroll,
  Shield,
  MapPin,
  Phone,
  MessageCircle,
  Search,
  Filter,
  CreditCard,
  CheckSquare,
  FileCheck2,
  Scale,
  Info,
} from 'lucide-react';
import { VendorItem, EventPlan } from '@/types';
import { formatINR, formatDate } from '@/lib/formatters';
import { getVendorImage, calculateVendorPaymentMilestones } from '@/lib/visualAssets';
import { VendorQuotationModal } from '../VendorQuotationModal';

interface VendorsTabProps {
  vendors: VendorItem[];
  plan?: EventPlan;
  onUpdateVendor: (index: number, updatedVendor: VendorItem) => void;
}

function getCategoryIcon(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes('cater') || cat.includes('food') || cat.includes('halwai') || cat.includes('dining')) {
    return Utensils;
  }
  if (cat.includes('photo') || cat.includes('video') || cat.includes('cinemat')) {
    return Camera;
  }
  if (cat.includes('decor') || cat.includes('mandap') || cat.includes('flower')) {
    return Sparkles;
  }
  if (cat.includes('music') || cat.includes('dj') || cat.includes('sound') || cat.includes('band')) {
    return Music;
  }
  if (cat.includes('venue') || cat.includes('banquet') || cat.includes('lawn') || cat.includes('hall')) {
    return Building;
  }
  if (cat.includes('makeup') || cat.includes('mehendi') || cat.includes('styling')) {
    return Palette;
  }
  if (cat.includes('pandit') || cat.includes('priest') || cat.includes('samagri') || cat.includes('puja')) {
    return Scroll;
  }
  if (cat.includes('pandal') || cat.includes('shamiana') || cat.includes('permission') || cat.includes('municipal')) {
    return Shield;
  }
  if (cat.includes('gift') || cat.includes('favor') || cat.includes('mithai')) {
    return Gift;
  }
  if (cat.includes('transport') || cat.includes('car') || cat.includes('shuttle')) {
    return Truck;
  }
  return Store;
}

export function VendorsTab({ vendors, plan, onUpdateVendor }: VendorsTabProps) {
  const [openQuestionsIndex, setOpenQuestionsIndex] = useState<number | null>(null);
  const [openChecklistIndex, setOpenChecklistIndex] = useState<number | null>(null);
  const [quotationVendorIndex, setQuotationVendorIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const totalEstimated = useMemo(() => vendors.reduce((acc, v) => acc + (v.estimatedCost || 0), 0), [vendors]);
  const totalActual = useMemo(() => vendors.reduce((acc, v) => acc + (v.actualCost || 0), 0), [vendors]);
  const bookedCount = useMemo(() => vendors.filter((v) => v.isBooked).length, [vendors]);

  const toggleBooked = (index: number) => {
    const target = vendors[index];
    onUpdateVendor(index, {
      ...target,
      isBooked: !target.isBooked,
    });
  };

  const handleActualCostChange = (index: number, cost: number) => {
    const target = vendors[index];
    onUpdateVendor(index, {
      ...target,
      actualCost: isNaN(cost) ? 0 : cost,
    });
  };

  const handleApplyQuote = (quoteCost: number, vendorName: string) => {
    if (quotationVendorIndex !== null) {
      const target = vendors[quotationVendorIndex];
      onUpdateVendor(quotationVendorIndex, {
        ...target,
        actualCost: quoteCost,
        vendorName: vendorName,
        isBooked: true,
      });
    }
  };

  const toggleMilestone = (vendorIndex: number, tranche: 'advancePaid' | 'midWayPaid' | 'finalPaid') => {
    const target = vendors[vendorIndex];
    const currentMilestones = target.paymentMilestones || calculateVendorPaymentMilestones(target.estimatedCost);
    const updated = {
      ...target,
      paymentMilestones: {
        ...currentMilestones,
        [tranche]: !currentMilestones[tranche],
      },
    };
    onUpdateVendor(vendorIndex, updated);
  };

  // Filter vendors by category or booked status
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        searchQuery === '' ||
        (v.vendorName && v.vendorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.specialty && v.specialty.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'booked') return v.isBooked;
      if (selectedFilter === 'pending') return !v.isBooked;
      return v.category.toLowerCase().includes(selectedFilter.toLowerCase());
    });
  }, [vendors, searchQuery, selectedFilter]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Vendor Spend KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Estimated Budget
          </span>
          <h4 className="text-2xl font-black text-foreground mt-1">
            {formatINR(totalEstimated)}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Across {vendors.length} specialized vendor categories
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Committed Actual Spend
          </span>
          <h4
            className={`text-2xl font-black mt-1 ${
              totalActual > totalEstimated ? 'text-destructive' : 'text-primary'
            }`}
          >
            {formatINR(totalActual)}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalActual === 0
              ? 'Enter actual contract amounts below'
              : totalActual <= totalEstimated
              ? `₹${(totalEstimated - totalActual).toLocaleString('en-IN')} remaining in buffer`
              : `₹${(totalActual - totalEstimated).toLocaleString('en-IN')} over initial estimate`}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contract Lock Status
          </span>
          <h4 className="text-2xl font-black text-accent-foreground mt-1">
            {bookedCount} of {vendors.length} Locked
          </h4>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${(bookedCount / Math.max(1, vendors.length)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dataset & Quotation Transparency Banner */}
      <div className="p-3.5 bg-muted/40 border border-border/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-muted-foreground shadow-sm">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Reference Benchmarks & Indicative Modeling:</strong> Vendor profiles are derived from AYOJA&apos;s curated regional planning dataset. Quotations reflect calculated market-rate tiers (Standard, Recommended, and Luxury) to guide family budget planning prior to contracting live suppliers.
          </span>
        </div>
      </div>

      {/* AYOJA Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-2xl shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor by name, category, or specialty..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-input bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Vendors' },
            { id: 'booked', label: `Locked (${bookedCount})` },
            { id: 'pending', label: `Pending (${vendors.length - bookedCount})` },
            { id: 'cater', label: 'Catering' },
            { id: 'decor', label: 'Decor' },
            { id: 'photo', label: 'Photo' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedFilter === f.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Cards Grid with Visual Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVendors.map((vendor, filteredIdx) => {
          // Find original index
          const originalIndex = vendors.indexOf(vendor);
          const index = originalIndex !== -1 ? originalIndex : filteredIdx;

          const Icon = getCategoryIcon(vendor.category);
          const isQuestionsOpen = openQuestionsIndex === index;
          const isChecklistOpen = openChecklistIndex === index;
          const imgUrl = vendor.imageUrl || getVendorImage(vendor.category);
          const milestones =
            vendor.paymentMilestones || calculateVendorPaymentMilestones(vendor.estimatedCost);

          return (
            <div
              key={vendor.category || index}
              className={`rounded-3xl border bg-card shadow-sm transition-all overflow-hidden flex flex-col justify-between ${
                vendor.isBooked
                  ? 'border-primary/50 ring-1 ring-primary/20 bg-primary/[0.02]'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <div>
                {/* Visual Image Header Banner */}
                <div className="relative h-36 w-full overflow-hidden bg-muted">
                  <img
                    src={imgUrl}
                    alt={vendor.vendorName || vendor.category}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5">
                      <Icon className="w-3 h-3 text-accent" />
                      <span>{vendor.category}</span>
                    </span>

                    {vendor.rating && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/90 text-white shadow-sm flex items-center gap-1">
                        ★ {vendor.rating}
                        {vendor.reviewCount && (
                          <span className="text-[10px] opacity-90">({vendor.reviewCount})</span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay Text */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight drop-shadow-md">
                      {vendor.vendorName || vendor.category}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Specialty and Verified Badge */}
                  <div className="space-y-1.5">
                    {vendor.specialty && (
                      <p className="text-xs font-medium text-foreground/90 line-clamp-2">
                        {vendor.specialty}
                      </p>
                    )}

                    {vendor.verifiedBadge && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/25 text-[11px] font-semibold">
                        <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{vendor.verifiedBadge}</span>
                      </div>
                    )}

                    {vendor.vendorAddress && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="truncate">{vendor.vendorAddress}</span>
                      </p>
                    )}

                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Target Lock Date: <strong>{formatDate(vendor.bookBy)}</strong></span>
                    </div>
                  </div>

                  {/* Estimated vs Actual Cost Input Row */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/80">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Estimated Cost</span>
                        <span className="text-[9px] font-medium text-amber-700 dark:text-amber-400">Market Avg</span>
                      </span>
                      <span className="text-base font-black text-foreground">
                        {formatINR(vendor.estimatedCost)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                        Actual Contract (₹)
                      </span>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-xs text-muted-foreground">₹</span>
                        <input
                          type="number"
                          value={vendor.actualCost || ''}
                          onChange={(e) => handleActualCostChange(index, parseFloat(e.target.value))}
                          placeholder="e.g. 150000"
                          className="w-full pl-6 pr-2.5 py-1 text-xs font-bold rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Compare Quotations & Audit Hidden Costs Action */}
                  {plan && (
                    <button
                      type="button"
                      onClick={() => setQuotationVendorIndex(index)}
                      className="w-full py-2 px-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-primary" />
                      <span>Compare 3 Quotes & Audit Hidden Costs</span>
                    </button>
                  )}

                  {/* Real-World 3-Tier Payment Tranche Tracker */}
                  <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-primary" />
                      <span>Contract Payment Tranches</span>
                    </span>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {/* Tranche 1 */}
                      <button
                        type="button"
                        onClick={() => toggleMilestone(index, 'advancePaid')}
                        className={`p-2 rounded-xl border text-[11px] font-medium transition-all ${
                          milestones.advancePaid
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'bg-card border-border hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        <span className="block text-[9px] uppercase font-bold opacity-80">
                          25% Token
                        </span>
                        <span>{formatINR(milestones.advanceToken)}</span>
                        <span className="block text-[9px] mt-0.5">
                          {milestones.advancePaid ? '✓ Paid' : '○ Pending'}
                        </span>
                      </button>

                      {/* Tranche 2 */}
                      <button
                        type="button"
                        onClick={() => toggleMilestone(index, 'midWayPaid')}
                        className={`p-2 rounded-xl border text-[11px] font-medium transition-all ${
                          milestones.midWayPaid
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'bg-card border-border hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        <span className="block text-[9px] uppercase font-bold opacity-80">
                          50% Mid-Way
                        </span>
                        <span>{formatINR(milestones.midWay)}</span>
                        <span className="block text-[9px] mt-0.5">
                          {milestones.midWayPaid ? '✓ Paid' : '○ Pending'}
                        </span>
                      </button>

                      {/* Tranche 3 */}
                      <button
                        type="button"
                        onClick={() => toggleMilestone(index, 'finalPaid')}
                        className={`p-2 rounded-xl border text-[11px] font-medium transition-all ${
                          milestones.finalPaid
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'bg-card border-border hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        <span className="block text-[9px] uppercase font-bold opacity-80">
                          25% Final
                        </span>
                        <span>{formatINR(milestones.finalSettlement)}</span>
                        <span className="block text-[9px] mt-0.5">
                          {milestones.finalPaid ? '✓ Paid' : '○ Pending'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Checklist & Questions Accordions */}
                  <div className="space-y-2 pt-1">
                    {/* Checklist */}
                    {vendor.checklist && vendor.checklist.length > 0 && (
                      <div className="border border-border/70 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenChecklistIndex(isChecklistOpen ? null : index)}
                          className="w-full px-3.5 py-2.5 bg-muted/30 hover:bg-muted/60 text-xs font-bold text-foreground flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5 text-primary" />
                            <span>Inclusions Checklist ({vendor.checklist.length})</span>
                          </span>
                          {isChecklistOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        {isChecklistOpen && (
                          <div className="p-3 bg-card space-y-1.5 text-xs text-muted-foreground">
                            {vendor.checklist.map((item, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="text-primary font-bold">✓</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Questions */}
                    {vendor.questionsToAsk && vendor.questionsToAsk.length > 0 && (
                      <div className="border border-border/70 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenQuestionsIndex(isQuestionsOpen ? null : index)}
                          className="w-full px-3.5 py-2.5 bg-muted/30 hover:bg-muted/60 text-xs font-bold text-foreground flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-accent" />
                            <span>Questions to Ask Before Advance ({vendor.questionsToAsk.length})</span>
                          </span>
                          {isQuestionsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        {isQuestionsOpen && (
                          <div className="p-3 bg-card space-y-1.5 text-xs text-muted-foreground">
                            {vendor.questionsToAsk.map((q, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="text-accent font-bold">?</span>
                                <span>{q}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar Footer */}
              <div className="px-5 py-3.5 bg-muted/40 border-t border-border flex items-center justify-between gap-3">
                {/* Contact Links */}
                <div className="flex items-center gap-2">
                  {vendor.vendorPhone && (
                    <>
                      <a
                        href={`tel:${vendor.vendorPhone}`}
                        className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all hover:scale-105 active:scale-95"
                        title={`Call ${vendor.vendorPhone}`}
                      >
                        <Phone className="w-3.5 h-3.5 text-primary" />
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `Namaste! Inquiring regarding services for our upcoming event in ${
                            vendor.vendorAddress || 'city'
                          }.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    </>
                  )}
                </div>

                {/* Primary Booked Button */}
                <button
                  type="button"
                  onClick={() => toggleBooked(index)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    vendor.isBooked
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'border border-border bg-card hover:bg-muted text-foreground'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{vendor.isBooked ? 'Contract Locked' : 'Mark Booked'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vendor Quotation Comparison Matrix Modal */}
      {quotationVendorIndex !== null && plan && vendors[quotationVendorIndex] && (
        <VendorQuotationModal
          plan={plan}
          vendor={vendors[quotationVendorIndex]}
          isOpen={true}
          onClose={() => setQuotationVendorIndex(null)}
          onApplySelectedQuote={handleApplyQuote}
        />
      )}
    </div>
  );
}
