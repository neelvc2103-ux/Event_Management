import { describe, it, expect } from 'vitest';
import {
  formatINR,
  formatINRLakhs,
  formatDate,
  getDaysRemaining,
} from '../lib/formatters';

describe('Indian Rupee & Date Formatters', () => {
  describe('formatINR', () => {
    it('formats 0 correctly as ₹0', () => {
      expect(formatINR(0)).toBe('₹0');
    });

    it('formats Indian numbering system with thousands, lakhs, and crores', () => {
      expect(formatINR(5000)).toBe('₹5,000');
      expect(formatINR(50000)).toBe('₹50,000');
      expect(formatINR(1500000)).toBe('₹15,00,000');
      expect(formatINR(25000000)).toBe('₹2,50,00,000');
    });

    it('handles negative or NaN values safely without throwing', () => {
      expect(formatINR(NaN)).toBe('₹0');
      expect(formatINR(Infinity)).toBe('₹0');
      expect(formatINR(-500)).toBe('-₹500');
    });
  });

  describe('formatINRLakhs', () => {
    it('formats figures >= 1 Crore into Cr notation', () => {
      expect(formatINRLakhs(10000000)).toBe('₹1 Cr');
      expect(formatINRLakhs(25000000)).toBe('₹2.50 Cr');
      expect(formatINRLakhs(15800000)).toBe('₹1.58 Cr');
    });

    it('formats figures >= 1 Lakh into Lakh notation', () => {
      expect(formatINRLakhs(100000)).toBe('₹1 Lakh');
      expect(formatINRLakhs(1500000)).toBe('₹15 Lakh');
      expect(formatINRLakhs(550000)).toBe('₹5.50 Lakh');
    });

    it('formats figures between ₹1,000 and ₹1 Lakh in k notation', () => {
      expect(formatINRLakhs(30000)).toBe('₹30k');
      expect(formatINRLakhs(95000)).toBe('₹95k');
    });

    it('safely handles non-finite inputs', () => {
      expect(formatINRLakhs(NaN)).toBe('₹0');
      expect(formatINRLakhs(Infinity)).toBe('₹0');
    });
  });

  describe('formatDate', () => {
    it('formats standard ISO date string to readable Indian convention format', () => {
      const formatted = formatDate('2027-02-20');
      expect(formatted).toMatch(/20.*Feb.*2027/i);
    });

    it('returns original or empty string when date is invalid or empty', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate('invalid-date-token')).toBe('invalid-date-token');
    });
  });

  describe('getDaysRemaining', () => {
    it('returns "Today is the big day!" when event date is today', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = getDaysRemaining(today);
      expect(result.days).toBe(0);
      expect(result.label).toBe('Today is the big day!');
      expect(result.isPast).toBe(false);
    });

    it('returns future days count correctly', () => {
      const future = new Date();
      future.setDate(future.getDate() + 45);
      const futureDateStr = future.toISOString().split('T')[0];

      const result = getDaysRemaining(futureDateStr);
      expect(result.days).toBe(45);
      expect(result.label).toBe('45 days left');
      expect(result.isPast).toBe(false);
    });

    it('returns past days count correctly', () => {
      const past = new Date();
      past.setDate(past.getDate() - 10);
      const pastDateStr = past.toISOString().split('T')[0];

      const result = getDaysRemaining(pastDateStr);
      expect(result.days).toBe(10);
      expect(result.label).toBe('10 days ago');
      expect(result.isPast).toBe(true);
    });

    it('handles malformed date string safely', () => {
      const result = getDaysRemaining('garbage-input');
      expect(result.days).toBe(0);
      expect(result.label).toBe('Invalid date');
    });
  });
});
