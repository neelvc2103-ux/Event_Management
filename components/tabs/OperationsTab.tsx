'use client';

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MapPin,
  Phone,
  UserCheck,
  Ticket,
  Shield,
  Volume2,
  Sparkles,
  QrCode,
  Building,
  Flower2,
} from 'lucide-react';
import { EventPlan, RunOfShowItem } from '@/types';
import { formatDate } from '@/lib/formatters';

interface OperationsTabProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
  onOpenDigitalPass: () => void;
  includeVipPasses?: boolean;
  onToggleVip?: () => void;
}

export function OperationsTab({
  plan,
  onUpdatePlan,
  onOpenDigitalPass,
  includeVipPasses = false,
  onToggleVip,
}: OperationsTabProps) {
  const [filterRole, setFilterRole] = useState<'all' | 'pending' | 'completed'>('all');

  const runOfShow = plan.runOfShow || [];

  const toggleMilestone = (id: string) => {
    const updated = runOfShow.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdatePlan({
      ...plan,
      runOfShow: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const filteredItems = runOfShow.filter((item) => {
    if (filterRole === 'pending') return !item.completed;
    if (filterRole === 'completed') return item.completed;
    return true;
  });

  const completedCount = runOfShow.filter((r) => r.completed).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Operations Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Run-of-Show Progress
          </span>
          <h4 className="text-xl font-black text-foreground">
            {completedCount} / {runOfShow.length} Checkpoints
          </h4>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${(completedCount / Math.max(1, runOfShow.length)) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sound & Police Curfew
          </span>
          <h4 className="text-xl font-black text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            <span>10:00 PM Sharp</span>
          </h4>
          <p className="text-xs text-muted-foreground">
            Outdoor speaker cutoff; indoor lounge acoustic switch
          </p>
        </div>

        {includeVipPasses ? (
          <div className="p-5 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-card via-card to-amber-500/10 shadow-md flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30">
                  Gate & Security Desk (Active)
                </span>
                <h4 className="text-lg font-black text-foreground mt-1 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-amber-500" />
                  <span>VIP Gate Pass & Access Badge</span>
                </h4>
                <p className="text-xs text-muted-foreground">Scannable QR credentials for family elders & guests</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-lg">
                AYOJA-{plan.id.slice(-6).toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenDigitalPass}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Preview VIP Badge</span>
              </button>
              {onToggleVip && (
                <button
                  onClick={onToggleVip}
                  className="py-2 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs text-muted-foreground font-semibold transition-all"
                  title="Disable VIP Passes if not required"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Gate & Security Desk
              </span>
              <h4 className="text-lg font-black text-foreground mt-1 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-primary" />
                <span>Standard Guest List Check-in</span>
              </h4>
              <p className="text-xs text-muted-foreground">Digital RSVP verification at venue entrance</p>
            </div>
            {onToggleVip && (
              <button
                onClick={onToggleVip}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                title="Only enable VIP passes if requested by customer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>+ Need VIP Badges & Passes? (Optional)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: Run-of-Show Timeline & Day-of Kit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hour-by-Hour Run-of-Show (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Hour-by-Hour Operational Run-of-Show</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Assigned family coordinators and statutory checkpoints for event day
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted border border-border text-[11px] font-semibold">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterRole === 'all' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                All ({runOfShow.length})
              </button>
              <button
                onClick={() => setFilterRole('pending')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterRole === 'pending' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterRole('completed')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterRole === 'completed' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Done
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.completed
                    ? 'border-border/60 bg-muted/30 opacity-75'
                    : 'border-border bg-card shadow-sm hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleMilestone(item.id)}
                      className="mt-0.5 text-primary hover:text-primary/80 transition-colors shrink-0"
                      aria-label={item.completed ? 'Mark pending' : 'Mark completed'}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          {item.time}
                        </span>
                        <h4
                          className={`text-sm font-bold ${
                            item.completed
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {item.eventTitle}
                        </h4>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-accent shrink-0" />
                          <span>{item.location}</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <UserCheck className="w-3 h-3 text-primary shrink-0" />
                          <span>{item.coordinator}</span>
                        </span>
                        {item.phone && (
                          <a
                            href={`tel:${item.phone}`}
                            className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                          >
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{item.phone}</span>
                          </a>
                        )}
                      </div>

                      {item.urgentNote && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/20 text-[11px] font-semibold mt-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{item.urgentNote}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Family Coordinator Roles & Day-of Survival Kit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Day-of Survival Kit */}
          <div className="p-5 rounded-3xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <span className="text-base">🎒</span>
              <span>Event Day Survival Kit (Indian Celebration Rules)</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/80">
                <p className="font-bold text-foreground">🩹 Emergency Bridal/Host Pouch</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Keep safety pins, fabric tape, band-aids, breath mints, sewing kit, and flat sandals stationed under the main stage.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/80">
                <p className="font-bold text-foreground">🍛 Hungry Cousin Rule</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Order caterer to reserve 20 hot snack boxes at 06:30 PM for family coordinators who will be running the show during dinner rush.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/80">
                <p className="font-bold text-foreground">⚡ Dedicated Charger Captain</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Designate 1 cousin to hold 2 fully charged 20,000mAh power banks for bride, groom, and key coordinators.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/80">
                <p className="font-bold text-foreground">💵 Shagun Envelope Stash</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Have 15 ready envelopes with ₹100 / ₹500 currency notes for dhol players, tempo drivers, and extra helpers.
                </p>
              </div>
            </div>
          </div>

          {/* Local Statutory & Logistics Reference Card */}
          <div className="p-5 rounded-3xl border border-border bg-card shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-primary" />
              <span>Real Municipal & Civic Contacts</span>
            </h4>

            {plan.civicCompliance && (
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Police Sound NOC Desk</span>
                    <span className="text-[11px] text-muted-foreground">
                      {plan.civicCompliance.soundCurfew}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1 border-t border-border/60">
                  <Building className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Municipal Permission Ward</span>
                    <span className="text-[11px] text-muted-foreground">
                      {plan.civicCompliance.municipalOffice}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1 border-t border-border/60">
                  <Flower2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Wholesale Flower Market</span>
                    <span className="text-[11px] text-muted-foreground">
                      {plan.civicCompliance.flowerMarket} (Source fresh blooms by 5:00 AM)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

