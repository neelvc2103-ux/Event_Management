import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// Bounded in-memory rate limit store: IP -> RateLimitRecord
const MAX_RATE_LIMIT_ENTRIES = 10000;
const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((record, ip) => {
      if (record.resetAt <= now) {
        rateLimitMap.delete(ip);
      }
    });
  }, 5 * 60 * 1000);
}

/**
 * Basic in-memory rate limiter per IP with bounded capacity to prevent memory exhaustion.
 */
export function checkRateLimit(
  req: NextRequest,
  limit: number = 20,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetInSec: number } {
  // Extract client IP address from headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // If map size exceeds bound, evict oldest entries
  if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
    const firstKey = rateLimitMap.keys().next().value;
    if (firstKey) rateLimitMap.delete(firstKey);
  }

  if (!record || record.resetAt <= now) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetInSec: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetInSec: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Sanitizes input string to prevent XSS, HTML injection, control characters,
 * and malicious prompt escape sequences.
 */
export function sanitizeInput(input: string, maxLength: number = 5000): string {
  if (typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    // Remove null bytes and invisible control characters (preserve tabs/newlines if desired)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip dangerous HTML brackets
    .replace(/[<>]/g, '')
    // Neutralize prompt escape tokens that mimic system boundaries
    .replace(/<\/PLAN_UPDATE>/gi, '')
    .replace(/<PLAN_UPDATE>/gi, '')
    .trim();
}

