'use client';

import React, { useEffect } from 'react';
import {
  FolderOpen,
  X,
  Trash2,
  Calendar,
  IndianRupee,
  MapPin,
  Users,
  Copy,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { EventPlan } from '@/types';
import { formatINR, formatDate } from '@/lib/formatters';

interface SavedPlansDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plans: EventPlan[];
  activePlanId: string | null;
  onSelectPlan: (plan: EventPlan) => void;
  onDeletePlan: (id: string) => void;
  onNewPlan: () => void;
}

export function SavedPlansDrawer({
  isOpen,
  onClose,
  plans,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onNewPlan,
}: SavedPlansDrawerProps) {
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

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 no-print transition-opacity"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-plans-title"
        className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-card border-l border-border z-50 shadow-2xl flex flex-col no-print animate-fade-in"
      >
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 id="saved-plans-title" className="text-base font-bold text-foreground">My Saved Plans</h3>
              <p className="text-xs text-muted-foreground">{plans.length} plan(s) in local storage</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved plans"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: Create New */}
        <div className="p-4 border-b border-border/80 bg-background/50">
          <button
            onClick={() => {
              onClose();
              onNewPlan();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Plan a New Event</span>
          </button>
        </div>

        {/* Plans List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {plans.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-foreground">No plans saved yet</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Any plan you generate is automatically saved here so you can revisit, modify, and export it anytime.
              </p>
            </div>
          ) : (
            plans.map((plan) => {
              const isActive = plan.id === activePlanId;
              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isActive
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm'
                      : 'border-border bg-background hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {plan.formData.eventType}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1 leading-snug">
                        {plan.formData.eventName}
                      </h4>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete plan "${plan.formData.eventName}"?`)) {
                          onDeletePlan(plan.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Plan"
                      aria-label={`Delete plan "${plan.formData.eventName}"`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-primary" />
                      {formatINR(plan.budget.total)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {plan.formData.guestCount} guests
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {plan.formData.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(plan.formData.eventDate)}
                    </span>
                  </div>

                  {/* Load Plan CTA */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPlan(plan);
                      onClose();
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-primary flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{isActive ? 'Viewing Active Plan' : 'Open This Plan'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
