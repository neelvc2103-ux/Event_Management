import { BudgetCategory } from '@/types';

/**
 * Normalizes an array of budget categories so their percentages sum to exactly 100.
 * Uses the Largest Remainder Method to avoid rounding drift.
 */
export function normalizePercentages(categories: BudgetCategory[]): BudgetCategory[] {
  if (!categories || categories.length === 0) return [];
  if (categories.length === 1) {
    return [{ ...categories[0], percentage: 100 }];
  }

  const rawSum = categories.reduce((acc, cat) => acc + (cat.percentage || 0), 0);
  if (rawSum <= 0) {
    // If all are 0, divide evenly
    const evenPct = Math.floor(100 / categories.length);
    const remainder = 100 - evenPct * categories.length;
    return categories.map((cat, idx) => ({
      ...cat,
      percentage: evenPct + (idx < remainder ? 1 : 0),
    }));
  }

  // Scale to 100 with 1 decimal place or integer
  const scaled = categories.map((cat) => ({
    cat,
    target: (cat.percentage / rawSum) * 100,
    floor: Math.floor((cat.percentage / rawSum) * 100),
    remainder: ((cat.percentage / rawSum) * 100) - Math.floor((cat.percentage / rawSum) * 100),
  }));

  let currentSum = scaled.reduce((acc, item) => acc + item.floor, 0);
  let difference = 100 - currentSum;

  // Sort indices by largest remainder descending to distribute the integer remainder
  const sortedByRemainder = [...scaled]
    .map((item, index) => ({ index, remainder: item.remainder }))
    .sort((a, b) => b.remainder - a.remainder);

  const result = scaled.map((item) => ({ ...item.cat, percentage: item.floor }));

  for (let i = 0; i < difference && i < sortedByRemainder.length; i++) {
    const targetIdx = sortedByRemainder[i].index;
    result[targetIdx].percentage += 1;
  }

  return result;
}

/**
 * Recomputes rupee amounts for all categories based on percentages and total budget.
 * Guarantees that the sum of all category amounts equals totalBudget down to the exact rupee.
 */
export function recomputeAmounts(categories: BudgetCategory[], totalBudget: number): BudgetCategory[] {
  if (!categories || categories.length === 0) return [];
  const safeBudget = Number.isFinite(totalBudget) ? Math.max(0, Math.round(totalBudget)) : 0;

  const normalized = normalizePercentages(categories);
  let allocatedTotal = 0;

  const withAmounts = normalized.map((cat) => {
    const rawAmt = Math.round((cat.percentage / 100) * safeBudget);
    allocatedTotal += rawAmt;
    return {
      ...cat,
      amount: rawAmt,
    };
  });

  const diff = safeBudget - allocatedTotal;
  if (diff !== 0 && withAmounts.length > 0) {
    // Allocate rounding difference to the category with highest percentage
    let maxIdx = 0;
    for (let i = 1; i < withAmounts.length; i++) {
      if (withAmounts[i].percentage > withAmounts[maxIdx].percentage) {
        maxIdx = i;
      }
    }
    withAmounts[maxIdx].amount += diff;
  }

  return withAmounts;
}

/**
 * Auto-rebalances category percentages when the user modifies one category.
 * The delta is proportionally absorbed by the other categories.
 * Guarantees that the total percentage remains 100% and amounts sum to totalBudget.
 */
export function rebalanceCategories(
  categories: BudgetCategory[],
  changedIndex: number,
  newPercentage: number,
  totalBudget: number
): BudgetCategory[] {
  if (!categories || categories.length === 0) return [];
  const safeBudget = Number.isFinite(totalBudget) ? Math.max(0, Math.round(totalBudget)) : 0;
  
  if (changedIndex < 0 || changedIndex >= categories.length) {
    return recomputeAmounts(categories, safeBudget);
  }

  if (categories.length === 1) {
    return [{ ...categories[0], percentage: 100, amount: safeBudget }];
  }

  const validPct = Number.isFinite(newPercentage) ? newPercentage : 0;
  const clampedNewPct = Math.max(0, Math.min(100, Math.round(validPct)));
  const remainingPct = 100 - clampedNewPct;

  const otherIndices = categories
    .map((_, i) => i)
    .filter((i) => i !== changedIndex);

  const sumOtherPcts = otherIndices.reduce(
    (sum, idx) => sum + (Number.isFinite(categories[idx].percentage) ? categories[idx].percentage : 0),
    0
  );

  const updated = categories.map((cat) => ({ ...cat }));
  updated[changedIndex].percentage = clampedNewPct;

  if (sumOtherPcts > 0) {
    let allocatedOthers = 0;
    otherIndices.forEach((idx, i) => {
      if (i === otherIndices.length - 1) {
        // Last item takes remaining to ensure exact 100%
        updated[idx].percentage = Math.max(0, remainingPct - allocatedOthers);
      } else {
        const ratio = (categories[idx].percentage || 0) / sumOtherPcts;
        const newPct = Math.round(ratio * remainingPct);
        updated[idx].percentage = newPct;
        allocatedOthers += newPct;
      }
    });
  } else {
    // If all other categories were 0%, distribute remainder equally
    const perCat = Math.floor(remainingPct / otherIndices.length);
    const remainder = remainingPct % otherIndices.length;
    otherIndices.forEach((idx, i) => {
      updated[idx].percentage = perCat + (i < remainder ? 1 : 0);
    });
  }

  // Final check to make sure sum is strictly 100
  const finalSum = updated.reduce((sum, c) => sum + c.percentage, 0);
  if (finalSum !== 100 && otherIndices.length > 0) {
    const diff = 100 - finalSum;
    updated[otherIndices[0]].percentage = Math.max(0, updated[otherIndices[0]].percentage + diff);
  }

  // Recompute rupee amounts so sum(amounts) === totalBudget
  return recomputeAmounts(updated, safeBudget);
}

/**
 * Rebalance categories when a rupee amount is manually modified by the user
 */
export function rebalanceByAmount(
  categories: BudgetCategory[],
  changedIndex: number,
  newAmount: number,
  totalBudget: number
): BudgetCategory[] {
  const safeBudget = Number.isFinite(totalBudget) ? Math.max(0, totalBudget) : 0;
  if (safeBudget <= 0) return categories;
  const safeAmt = Number.isFinite(newAmount) ? newAmount : 0;
  const clampedAmount = Math.max(0, Math.min(safeBudget, safeAmt));
  const newPct = (clampedAmount / safeBudget) * 100;
  return rebalanceCategories(categories, changedIndex, newPct, safeBudget);
}
