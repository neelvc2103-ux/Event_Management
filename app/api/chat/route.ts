import { NextRequest, NextResponse } from 'next/server';
import { chatRequestSchema } from '@/lib/schemas';
import { handleAssistantChat } from '@/lib/llmClient';
import { checkRateLimit, sanitizeInput } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, 25, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please take a quick breath before sending another message.', resetInSec: rateLimit.resetInSec },
        { status: 429 }
      );
    }

    const body = await req.json();
    const sanitizedMessage = sanitizeInput(body.message || '', 1000);

    const validation = chatRequestSchema.safeParse({
      ...body,
      message: sanitizedMessage,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid message request', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { plan, message, conversationHistory } = validation.data;

    // Timeout after 25 seconds
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Assistant response timed out')), 25000)
    );

    const chatPromise = handleAssistantChat(plan, message, conversationHistory);
    const result = await Promise.race([chatPromise, timeoutPromise]);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/chat] Error:', error);
    return NextResponse.json(
      { error: error.message || 'The planning assistant could not respond right now.' },
      { status: 500 }
    );
  }
}
