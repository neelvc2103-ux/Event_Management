import { NextRequest, NextResponse } from 'next/server';
import { EventPlan } from '@/types';
import { persistPlanToCloud, fetchPlanFromCloud, isCloudDatabaseConfigured } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan = body.plan as EventPlan;

    if (!plan || !plan.id) {
      return NextResponse.json({ error: 'Invalid plan payload' }, { status: 400 });
    }

    const cloudResult = await persistPlanToCloud(plan);

    return NextResponse.json({
      success: true,
      cloudSaved: cloudResult.success,
      mode: cloudResult.mode,
      planId: plan.id,
      shareUrl: `${req.nextUrl.origin}/?planId=${plan.id}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing plan ID' }, { status: 400 });
    }

    const plan = await fetchPlanFromCloud(id);
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found or cloud DB unconfigured' }, { status: 404 });
    }

    return NextResponse.json({ plan });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

