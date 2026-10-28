'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { VendorItem } from '@/types';
import { formatINR, formatDate } from '@/lib/formatters';

interface VendorsTabProps {
  vendors: VendorItem[];
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

export function VendorsTab({ vendors, onUpdateVendor }: VendorsTabProps) {
  const [openQuestionsIndex, setOpenQuestionsIndex] = useState<number | null>(null);

  const totalEstimated = React.useMemo(() => vendors.reduce((acc, v) => acc + (v.estimatedCost || 0), 0), [vendors]);
  const totalActual = React.useMemo(() => vendors.reduce((acc, v) => acc + (v.actualCost || 0), 0), [vendors]);
  const bookedCount = React.useMemo(() => vendors.filter((v) => v.isBooked).length, [vendors]);

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Vendor Spend Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Estimated Cost
          </span>
          <h4 className="text-xl font-black text-foreground mt-1">
            {formatINR(totalEstimated)}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Across {vendors.length} vendor categories
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Actual Spend
          </span>
          <h4 className={`text-xl font-black mt-1 ${totalActual > totalEstimated ? 'text-destructive' : 'text-primary'}`}>
            {formatINR(totalActual)}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalActual === 0
              ? 'Enter actual costs below to track spend'
              : totalActual <= totalEstimated
              ? `₹${(totalEstimated - totalActual).toLocaleString('en-IN')} within estimate`
              : `₹${(totalActual - totalEstimated).toLocaleString('en-IN')} over estimate`}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contract Status
          </span>
          <h4 className="text-xl font-black text-accent-foreground mt-1">
            {bookedCount} / {vendors.length} Booked
          </h4>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${(bookedCount / Math.max(1, vendors.length)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vendors.map((vendor, index) => {
          const Icon = getCategoryIcon(vendor.category);
          const isQuestionsOpen = openQuestionsIndex === index;
          const variance = (vendor.actualCost || 0) - vendor.estimatedCost;

          return (
            <div
              key={vendor.category || index}
              className={`p-6 rounded-2xl border bg-card shadow-sm transition-all space-y-5 ${
                vendor.isBooked
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      vendor.isBooked
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-muted text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {vendor.category}
                      </span>
                      {vendor.rating && (
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                          ★ {vendor.rating}
                          {vendor.reviewCount && (
                            <span className="text-[10px] font-normal text-muted-foreground">({vendor.reviewCount})</span>
                          )}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground leading-tight mt-1">
                      {vendor.vendorName || vendor.category}
                    </h3>
                    {vendor.specialty && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {vendor.specialty}
                      </p>
                    )}
                    {vendor.vendorAddress && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-accent shrink-0" />
                        <span className="truncate">{vendor.vendorAddress}</span>
                      </p>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Book by: {formatDate(vendor.bookBy)}
                    </span>
                  </div>
                </div>

                {/* Right Action: Booked Toggle & Phone Inquiry */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    role="button"
                    aria-pressed={vendor.isBooked}
                    onClick={() => toggleBooked(index)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      vendor.isBooked
                        ? 'bg-primary text-white shadow-sm'
                        : 'border border-border bg-background hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{vendor.isBooked ? 'Booked' : 'Mark Booked'}</span>
                  </button>

                  {vendor.vendorPhone && (
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Namaste! Inquiring regarding services for our upcoming event in ${vendor.vendorAddress || 'city'}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                    >
                      <span>Inquire: {vendor.vendorPhone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Verified Badge Pill */}
              {vendor.verifiedBadge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 text-[11px] font-semibold">
                  <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{vendor.verifiedBadge}</span>
                </div>
              )}

              {/* Estimated vs Actual Cost Input Row */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/80">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                    Estimated Cost
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {formatINR(vendor.estimatedCost)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                    Actual Spent (₹)
                  </span>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">₹</span>
                    <input
                      type="number"
                      step="500"
                      min="0"
                      aria-label={`Actual cost spent for ${vendor.category}`}
                      value={vendor.actualCost || ''}
                      onChange={(e) => handleActualCostChange(index, parseFloat(e.target.value))}
                      placeholder="0"
                      className="w-full pl-5 pr-2 py-1 rounded-lg border border-input bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>

                {vendor.actualCost !== undefined && vendor.actualCost > 0 && (
                  <div className="col-span-2 pt-1 border-t border-border/50 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Variance:</span>
                    <span
                      className={`font-bold ${
                        variance > 0
                          ? 'text-destructive'
                          : variance < 0
                          ? 'text-emerald-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {variance > 0
                        ? `+₹${variance.toLocaleString('en-IN')} over estimate`
                        : variance < 0
                        ? `Saved ₹${Math.abs(variance).toLocaleString('en-IN')}`
                        : 'Exact match'}
                    </span>
                  </div>
                )}
              </div>

              {/* Checklist */}
              {vendor.checklist && vendor.checklist.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Execution Checklist
                  </span>
                  <ul className="space-y-1.5 text-xs text-foreground">
                    {vendor.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions to Ask (Collapsible Accordion) */}
              {vendor.questionsToAsk && vendor.questionsToAsk.length > 0 && (
                <div className="pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => setOpenQuestionsIndex(isQuestionsOpen ? null : index)}
                    aria-expanded={isQuestionsOpen}
                    aria-controls={`vendor-questions-${index}`}
                    className="w-full flex items-center justify-between text-xs font-bold text-primary hover:underline py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-primary" />
                      Key Questions to Ask Before Signing ({vendor.questionsToAsk.length})
                    </span>
                    {isQuestionsOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isQuestionsOpen && (
                    <div
                      id={`vendor-questions-${index}`}
                      className="mt-3 p-3.5 rounded-xl bg-accent/10 border border-accent/25 space-y-2 animate-fade-in"
                    >
                      {vendor.questionsToAsk.map((q, qIdx) => (
                        <div key={qIdx} className="flex items-start gap-2 text-xs text-foreground">
                          <span className="text-accent font-bold">•</span>
                          <span className="leading-relaxed">{q}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
