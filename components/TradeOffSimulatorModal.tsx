'use client';

import React, { useState } from 'react';
import {
  X,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Calendar,
  IndianRupee,
  Utensils,
  Palette,
  ArrowRight,
  RefreshCw,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { EventPlan, BudgetCategory } from '@/types';
import { formatINR } from '@/lib/formatters';

interface TradeOffSimulatorModalProps {
  plan: EventPlan;
  isOpen: boolean;
  onClose: () => void;
  onApplyPlanUpdate: (updatedPlan: EventPlan) => void;
}

type ScenarioType = 'inflation_20' | 'guest_surge' | 'budget_cut' | 'fast_track';
type PriorityStrategy = 'food_first' | 'decor_first' | 'balanced' | 'intimate';

export function TradeOffSimulatorModal({
  plan,
  isOpen,
  onClose,
  onApplyPlanUpdate,
}: TradeOffSimulatorModalProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('inflation_20');
  const [activeStrategy, setActiveStrategy] = useState<PriorityStrategy>('food_first');
  const [appliedNotice, setAppliedNotice] = useState(false);

  if (!isOpen) return null;

  const currentTotal = plan.budget.total;
  const currentGuests = plan.formData.guestCount;

  // Compute simulated numbers based on scenario
  let simulatedBudgetTotal = currentTotal;
  let simulatedGuestCount = currentGuests;
  let scenarioTitle = '';
  let scenarioDescription = '';

  if (activeScenario === 'inflation_20') {
    simulatedBudgetTotal = Math.round(currentTotal * 1.2);
    scenarioTitle = '⚠️ Unexpected 20% Cost Inflation';
    scenarioDescription =
      'Vendor market rates and raw ingredient costs came in 20% higher than initial estimates. How should your plan absorb the spike without blowing total family funds?';
  } else if (activeScenario === 'guest_surge') {
    simulatedGuestCount = currentGuests + 50;
    simulatedBudgetTotal = Math.round(currentTotal * (1 + 50 / Math.max(50, currentGuests) * 0.45));
    scenarioTitle = '👥 +50 Surprise Family Guests Added';
    scenarioDescription =
      'The family extended invitations to 50 additional guests. Catering, seating, and venue space need dynamic re-allocation.';
  } else if (activeScenario === 'budget_cut') {
    simulatedBudgetTotal = Math.round(currentTotal * 0.85);
    scenarioTitle = '📉 Budget Tightened by 15%';
    scenarioDescription =
      'Total budget has been reduced by 15%. Intelligently rebalance essential vs. discretionary expenses to maintain celebration grandeur.';
  } else if (activeScenario === 'fast_track') {
    scenarioTitle = '⚡ Auspicious Date Fast-Track (-2 Weeks)';
    scenarioDescription =
      'Auspicious Muhurat or family schedule moved the celebration 2 weeks earlier. Timeline milestones and vendor locks need urgent compression.';
  }

  // Calculate rebalanced categories based on chosen strategy
  const rebalancedCategories: BudgetCategory[] = plan.budget.categories.map((cat) => {
    let factor = 1.0;
    const catName = cat.name.toLowerCase();

    if (activeScenario === 'inflation_20' || activeScenario === 'budget_cut') {
      const targetBudget = activeScenario === 'inflation_20' ? currentTotal : simulatedBudgetTotal;

      if (activeStrategy === 'food_first') {
        // Protect Catering, cut Decor & Extras
        if (catName.includes('cater') || catName.includes('food')) {
          factor = 1.05;
        } else if (catName.includes('decor') || catName.includes('mandap')) {
          factor = 0.80;
        } else if (catName.includes('gift') || catName.includes('invit')) {
          factor = 0.70;
        } else {
          factor = 0.95;
        }
      } else if (activeStrategy === 'decor_first') {
        // Protect Mandap & Photo, trim menu complexity
        if (catName.includes('decor') || catName.includes('mandap') || catName.includes('photo')) {
          factor = 1.05;
        } else if (catName.includes('cater') || catName.includes('food')) {
          factor = 0.85;
        } else {
          factor = 0.90;
        }
      } else if (activeStrategy === 'intimate') {
        // High quality everywhere, assume 15% fewer guests
        factor = 0.88;
      } else {
        // Balanced
        factor = activeScenario === 'budget_cut' ? 0.85 : 1.0;
      }

      const rawAmount = Math.round(cat.amount * factor);
      return {
        ...cat,
        amount: rawAmount,
      };
    }

    if (activeScenario === 'guest_surge') {
      if (catName.includes('cater') || catName.includes('food')) {
        return { ...cat, amount: Math.round(cat.amount * 1.25) };
      }
      return cat;
    }

    return cat;
  });

  // Normalize rebalanced categories so exact sum matches target
  const targetConsolidatedTotal =
    activeScenario === 'inflation_20'
      ? currentTotal // absorb inflation within original budget by trade-off!
      : simulatedBudgetTotal;

  const currentRebalancedSum = rebalancedCategories.reduce((sum, c) => sum + c.amount, 0);
  const normalizedCategories = rebalancedCategories.map((c) => {
    const proportional = Math.round((c.amount / Math.max(1, currentRebalancedSum)) * targetConsolidatedTotal);
    const percentage = Math.round((proportional / targetConsolidatedTotal) * 100);
    return {
      ...c,
      amount: proportional,
      percentage,
    };
  });

  // Fix any rounding error on largest category
  const finalSum = normalizedCategories.reduce((sum, c) => sum + c.amount, 0);
  const diff = targetConsolidatedTotal - finalSum;
  if (diff !== 0 && normalizedCategories.length > 0) {
    normalizedCategories[0].amount += diff;
  }

  const handleApplyTradeOff = () => {
    const updatedPlan: EventPlan = {
      ...plan,
      formData: {
        ...plan.formData,
        guestCount: simulatedGuestCount,
        totalBudget: targetConsolidatedTotal,
      },
      budget: {
        ...plan.budget,
        total: targetConsolidatedTotal,
        categories: normalizedCategories,
        savingTips: [
          `Trade-Off applied: ${activeStrategy.replace('_', ' ').toUpperCase()} strategy adopted.`,
          ...(plan.budget.savingTips || []),
        ],
      },
      summary: `${plan.summary}\n\n[Scenario Rebalanced on ${new Date().toLocaleDateString()}: Applied "${scenarioTitle}" with ${activeStrategy} priority.]`,
      updatedAt: new Date().toISOString(),
    };

    onApplyPlanUpdate(updatedPlan);
    setAppliedNotice(true);
    setTimeout(() => {
      setAppliedNotice(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print-bg">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tradeoff-modal-title"
        className="bg-card w-full max-w-4xl rounded-3xl shadow-2xl border border-border flex flex-col my-auto max-h-[94vh] overflow-hidden animate-fade-in"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-primary/10 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary text-white shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 id="tradeoff-modal-title" className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Dynamic Scenario & Trade-Off Simulator</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground border border-accent/30">
                  SME Recommended
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Understand the consequences of budget shifts and guest surges without starting from scratch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            aria-label="Close Trade-Off Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Step 1: Choose What-If Scenario */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span>1. Select Real-World Event Disruption Scenario:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setActiveScenario('inflation_20')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeScenario === 'inflation_20'
                    ? 'border-red-500 bg-red-500/10 text-red-900 dark:text-red-200 ring-2 ring-red-500/20'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span>+20% Cost Spike</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                  Vendor market rates came in 20% higher than target
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveScenario('guest_surge')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeScenario === 'guest_surge'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>+50 Extra Guests</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                  Family added 50 guests late in the planning cycle
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveScenario('budget_cut')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeScenario === 'budget_cut'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <TrendingDown className="w-4 h-4 text-amber-500" />
                  <span>-15% Budget Cut</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                  Total fund reduced; must preserve celebration vibe
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveScenario('fast_track')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeScenario === 'fast_track'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>-2 Weeks Faster</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                  Muhurat moved earlier; compress deadlines
                </p>
              </button>
            </div>
          </div>

          {/* Scenario Context Banner */}
          <div className="p-3.5 bg-muted/50 border border-border rounded-2xl text-xs space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <span>{scenarioTitle}</span>
            </span>
            <p className="text-muted-foreground">{scenarioDescription}</p>
          </div>

          {/* Step 2: Strategic Prioritization Philosophy */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span>2. Choose Family Value Priority (What Matters Most):</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setActiveStrategy('food_first')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeStrategy === 'food_first'
                    ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Utensils className="w-4 h-4 text-primary" />
                  <span>Gastronomy First (Food Feast)</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                  Protect 100% of the authentic banquet menu & live counters; absorb savings by simplifying mandap stage florals.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveStrategy('decor_first')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeStrategy === 'decor_first'
                    ? 'border-accent text-accent-foreground bg-accent/20 ring-2 ring-accent/30'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Palette className="w-4 h-4 text-accent" />
                  <span>Scenography & Mandap First</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                  Protect grand royal visual backdrop & photography; streamline dessert and appetizer counters to family style.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveStrategy('intimate')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeStrategy === 'intimate'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Intimate Luxury Curation</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                  Cap guest list slightly, preserve premium per-guest luxury experience across every touchpoint.
                </p>
              </button>
            </div>
          </div>

          {/* Step 3: Before vs. After Live Consequence Ledger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                3. Live Consequence & Auto-Rebalancing Ledger:
              </span>
              <span className="text-xs font-mono font-bold text-primary">
                Consolidated Target: {formatINR(targetConsolidatedTotal)}
              </span>
            </div>

            <div className="border border-border rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground font-bold border-b border-border">
                    <th className="py-2.5 px-3">Expense Category</th>
                    <th className="py-2.5 px-3 text-right">Current Spend</th>
                    <th className="py-2.5 px-3 text-right text-primary">Simulated Trade-Off</th>
                    <th className="py-2.5 px-3">Strategic Consequence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {normalizedCategories.map((cat, idx) => {
                    const orig = plan.budget.categories[idx] || cat;
                    const delta = cat.amount - orig.amount;
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                        <td className="py-2 px-3 font-semibold text-foreground">
                          {cat.name}
                        </td>
                        <td className="py-2 px-3 font-mono text-right text-muted-foreground">
                          {formatINR(orig.amount)}
                        </td>
                        <td className="py-2 px-3 font-mono text-right font-bold text-foreground">
                          <span>{formatINR(cat.amount)}</span>
                          {delta !== 0 && (
                            <span
                              className={`ml-1 text-[10px] font-mono ${
                                delta > 0 ? 'text-red-600' : 'text-emerald-600'
                              }`}
                            >
                              ({delta > 0 ? `+${formatINR(delta)}` : formatINR(delta)})
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-[11px] text-muted-foreground">
                          {delta > 0
                            ? 'Protected and reinforced per priority'
                            : delta < 0
                            ? 'Streamlined via wholesale procurement'
                            : 'Kept consistent with original contract'}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-primary/5 font-bold border-t-2 border-primary text-foreground">
                    <td className="py-2.5 px-3 uppercase">Total Fund</td>
                    <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                      {formatINR(currentTotal)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-primary">
                      {formatINR(targetConsolidatedTotal)}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-primary">
                      100% Mathematically Balanced • Zero Drift
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-muted/40 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyTradeOff}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-maroon-700 text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            {appliedNotice ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Rebalanced Plan Saved!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Apply Rebalanced Plan Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

