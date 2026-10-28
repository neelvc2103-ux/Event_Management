import { NextRequest, NextResponse } from 'next/server';
import { regenerateRequestSchema } from '@/lib/schemas';
import { regenerateIdeaSection } from '@/lib/llmClient';
import { checkRateLimit, sanitizeInput } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, 20, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a moment before regenerating.', resetInSec: rateLimit.resetInSec },
        { status: 429 }
      );
    }

    const body = await req.json();
    const sanitizedFeedback = body.userFeedback ? sanitizeInput(body.userFeedback, 500) : undefined;
    const validation = regenerateRequestSchema.safeParse({
      ...body,
      userFeedback: sanitizedFeedback,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid regenerate request', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { plan, section, userFeedback } = validation.data;

    // Timeout after 20 seconds
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Regeneration request timed out')), 20000)
    );

    const regenPromise = regenerateIdeaSection(plan, section, userFeedback);
    const updatedData = await Promise.race([regenPromise, timeoutPromise]);

    return NextResponse.json(
      {
        section,
        data: updatedData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/regenerate] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to regenerate ideas section.' },
      { status: 500 }
    );
  }
}
