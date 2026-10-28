import { describe, it, expect } from 'vitest';
import {
  normalizePercentages,
  recomputeAmounts,
  rebalanceCategories,
  rebalanceByAmount,
} from '../lib/budgetMath';
import { BudgetCategory } from '../types';

describe('Budget Math & Rebalancing', () => {
  it('normalizes percentages to sum to exactly 100', () => {
    const categories: BudgetCategory[] = [
      { name: 'Catering', percentage: 33, amount: 0, notes: '' },
      { name: 'Venue', percentage: 33, amount: 0, notes: '' },
      { name: 'Decor', percentage: 33, amount: 0, notes: '' },
    ];

    const normalized = normalizePercentages(categories);
    const sum = normalized.reduce((acc, c) => acc + c.percentage, 0);
    expect(sum).toBe(100);
  });

  it('guarantees rupee amounts sum exactly to the total budget down to ₹1', () => {
    const totalBudget = 1500000; // ₹15 Lakhs
    const categories: BudgetCategory[] = [
      { name: 'Catering', percentage: 35, amount: 0, notes: '' },
      { name: 'Venue', percentage: 22, amount: 0, notes: '' },
      { name: 'Decor', percentage: 15, amount: 0, notes: '' },
      { name: 'Photography', percentage: 10, amount: 0, notes: '' },
      { name: 'Bridal Makeup', percentage: 6, amount: 0, notes: '' },
      { name: 'Music & DJ', percentage: 5, amount: 0, notes: '' },
      { name: 'Panditji', percentage: 3, amount: 0, notes: '' },
      { name: 'Gifts & Favors', percentage: 4, amount: 0, notes: '' },
    ];

    const computed = recomputeAmounts(categories, totalBudget);
    const totalAmount = computed.reduce((acc, c) => acc + c.amount, 0);
    expect(totalAmount).toBe(totalBudget);
  });

  it('handles small budgets like ₹30,000 without losing rupees', () => {
    const totalBudget = 30000;
    const categories: BudgetCategory[] = [
      { name: 'Food', percentage: 38, amount: 0, notes: '' },
      { name: 'Decor', percentage: 22, amount: 0, notes: '' },
      { name: 'Cake', percentage: 12, amount: 0, notes: '' },
      { name: 'Entertainer', percentage: 12, amount: 0, notes: '' },
      { name: 'Gifts', percentage: 10, amount: 0, notes: '' },
      { name: 'Misc', percentage: 6, amount: 0, notes: '' },
    ];

    const computed = recomputeAmounts(categories, totalBudget);
    const totalAmount = computed.reduce((acc, c) => acc + c.amount, 0);
    expect(totalAmount).toBe(30000);
  });

  it('rebalances other categories proportionally when a category percentage is changed', () => {
    const totalBudget = 500000;
    const categories: BudgetCategory[] = [
      { name: 'Catering', percentage: 40, amount: 200000, notes: '' },
      { name: 'Venue', percentage: 30, amount: 150000, notes: '' },
      { name: 'Decor', percentage: 20, amount: 100000, notes: '' },
      { name: 'Music', percentage: 10, amount: 50000, notes: '' },
    ];

    // Increase Catering from 40% to 50%
    const rebalanced = rebalanceCategories(categories, 0, 50, totalBudget);

    expect(rebalanced[0].percentage).toBe(50);
    const totalPercentage = rebalanced.reduce((acc, c) => acc + c.percentage, 0);
    expect(totalPercentage).toBe(100);

    const totalAmount = rebalanced.reduce((acc, c) => acc + c.amount, 0);
    expect(totalAmount).toBe(totalBudget);
  });

  it('rebalances accurately when changed by a direct Rupee amount', () => {
    const totalBudget = 200000; // Society Ganesh Utsav ₹2 Lakhs
    const categories: BudgetCategory[] = [
      { name: 'Pandal & Stage', percentage: 30, amount: 60000, notes: '' },
      { name: 'Sound & Gen', percentage: 25, amount: 50000, notes: '' },
      { name: 'Prasad & Feast', percentage: 25, amount: 50000, notes: '' },
      { name: 'Decor & Murti', percentage: 20, amount: 40000, notes: '' },
    ];

    // Change Pandal to ₹1,00,000 (which is 50%)
    const rebalanced = rebalanceByAmount(categories, 0, 100000, totalBudget);

    expect(rebalanced[0].amount).toBe(100000);
    expect(rebalanced[0].percentage).toBe(50);

    const totalAmount = rebalanced.reduce((acc, c) => acc + c.amount, 0);
    expect(totalAmount).toBe(totalBudget);
  });

  it('handles zero budget safely without NaN or division by zero errors', () => {
    const categories: BudgetCategory[] = [
      { name: 'Catering', percentage: 50, amount: 0, notes: '' },
      { name: 'Decor', percentage: 50, amount: 0, notes: '' },
    ];
    const computed = recomputeAmounts(categories, 0);
    expect(computed[0].amount).toBe(0);
    expect(computed[1].amount).toBe(0);
  });

  it('handles NaN or non-finite inputs safely in rebalanceCategories', () => {
    const categories: BudgetCategory[] = [
      { name: 'Catering', percentage: 50, amount: 50000, notes: '' },
      { name: 'Decor', percentage: 50, amount: 50000, notes: '' },
    ];
    // Passing NaN as target percentage should clamp or preserve existing
    const result = rebalanceCategories(categories, 0, NaN, 100000);
    const sum = result.reduce((acc, c) => acc + c.percentage, 0);
    expect(sum).toBe(100);
  });

  it('handles a single category by locking it to 100%', () => {
    const categories: BudgetCategory[] = [
      { name: 'All Inclusive Package', percentage: 100, amount: 100000, notes: '' },
    ];
    const rebalanced = rebalanceCategories(categories, 0, 80, 100000);
    expect(rebalanced[0].percentage).toBe(100);
    expect(rebalanced[0].amount).toBe(100000);
  });

  it('returns original categories when targetIndex is out of bounds', () => {
    const categories: BudgetCategory[] = [
      { name: 'Catering', percentage: 50, amount: 50000, notes: '' },
      { name: 'Decor', percentage: 50, amount: 50000, notes: '' },
    ];
    const result = rebalanceCategories(categories, 99, 60, 100000);
    expect(result).toEqual(categories);
  });
});
