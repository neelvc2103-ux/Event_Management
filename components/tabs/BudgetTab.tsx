'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  IndianRupee,
  Lightbulb,
  Sliders,
  RotateCcw,
  TrendingDown,
  Info,
  Scale,
} from 'lucide-react';
import { BudgetData, BudgetCategory } from '@/types';
import { formatINR, formatINRLakhs } from '@/lib/formatters';
import { rebalanceCategories, rebalanceByAmount } from '@/lib/budgetMath';

interface BudgetTabProps {
  budget: BudgetData;
  onUpdateBudget: (newBudget: BudgetData) => void;
  onOpenTradeOffModal?: () => void;
}

const PALETTE = [
  '#8B1E3F', // Royal Maroon
  '#F59E0B', // Marigold Amber
  '#065F46', // Emerald Green
  '#D97706', // Deep Gold
  '#E2725B', // Terracotta
  '#7C3AED', // Royal Purple
  '#0284C7', // Peacock Blue
  '#DB2777', // Rani Pink
  '#4B5563', // Slate
];

export function BudgetTab({ budget, onUpdateBudget, onOpenTradeOffModal }: BudgetTabProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handlePercentageChange = (index: number, newPercentage: number) => {
    const updatedCategories = rebalanceCategories(
      budget.categories,
      index,
      newPercentage,
      budget.total
    );
    onUpdateBudget({
      ...budget,
      categories: updatedCategories,
    });
  };

  const handleAmountChange = (index: number, newAmount: number) => {
    const updatedCategories = rebalanceByAmount(
      budget.categories,
      index,
      newAmount,
      budget.total
    );
    onUpdateBudget({
      ...budget,
      categories: updatedCategories,
    });
  };

  const chartData = React.useMemo(
    () =>
      budget.categories.map((cat, index) => ({
        name: cat.name,
        value: cat.amount,
        percentage: cat.percentage,
        color: PALETTE[index % PALETTE.length],
      })),
    [budget.categories]
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border p-3 rounded-xl shadow-lg text-xs z-50">
          <p className="font-bold text-foreground">{data.name}</p>
          <p className="text-primary font-semibold mt-1">
            {formatINR(data.value)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Overview: Donut Chart & Total Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-card border border-border rounded-2xl p-6 shadow-sm">
        {/* Chart Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[280px]">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Budget
            </span>
            <span className="text-xl sm:text-2xl font-black text-primary tracking-tight">
              {formatINR(budget.total)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {budget.categories.length} categories
            </span>
          </div>
        </div>

        {/* Legend & Rebalancing Notice */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Interactive Auto-Rebalancing</span>
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
              100% Guaranteed Sum
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Drag any slider or type an amount. EventCraft instantly redistributes the remaining funds across all other categories so your total budget of{' '}
            <strong className="text-foreground">{formatINR(budget.total)}</strong> never drifts.
          </p>

          {/* Quick Legend Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {chartData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-border/80 bg-background/50"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-foreground truncate max-w-[140px]">
                  {item.name}
                </span>
                <span className="text-muted-foreground font-semibold">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editable Category Sliders */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-foreground">Category Allocations</h3>
            <p className="text-xs text-muted-foreground">Adjust sliders or enter rupees with guaranteed zero drift</p>
          </div>
          {onOpenTradeOffModal && (
            <button
              type="button"
              onClick={onOpenTradeOffModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-900 dark:text-red-200 transition-all shadow-sm active:scale-95"
            >
              <Scale className="w-3.5 h-3.5 text-red-500" />
              <span>⚖️ Simulate 20% Cost Spike & Trade-Offs</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budget.categories.map((category, index) => {
            const color = PALETTE[index % PALETTE.length];
            return (
              <div
                key={category.name || index}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 mt-0.5"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-tight">
                        {category.name}
                      </h4>
                      {category.notes && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1" title={category.notes}>
                          {category.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Percentage Badge */}
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground shrink-0">
                    {category.percentage}%
                  </span>
                </div>

                {/* Amount input & Slider */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={category.percentage}
                      aria-label={`${category.name} budget percentage`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={category.percentage}
                      aria-valuetext={`${category.percentage} percent`}
                      onChange={(e) => handlePercentageChange(index, parseFloat(e.target.value) || 0)}
                      className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                    />

                    {/* Numeric Rupee Input */}
                    <div className="relative shrink-0 w-32">
                      <span className="absolute left-2.5 top-2 text-xs text-muted-foreground font-semibold">₹</span>
                      <input
                        type="number"
                        step="1000"
                        min="0"
                        max={budget.total}
                        value={category.amount}
                        aria-label={`${category.name} budget amount in rupees`}
                        onChange={(e) => handleAmountChange(index, parseFloat(e.target.value) || 0)}
                        className="w-full pl-6 pr-2.5 py-1.5 rounded-lg border border-input bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saving Tips Section */}
      {budget.savingTips && budget.savingTips.length > 0 && (
        <div className="bg-accent/10 border border-accent/25 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-accent-foreground">
            <Lightbulb className="w-5 h-5 text-accent shrink-0" />
            <h3 className="text-base font-bold">Smart Indian Cost-Saving Tips</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {budget.savingTips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-card/80 border border-accent/20 text-xs text-foreground leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent-foreground font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
