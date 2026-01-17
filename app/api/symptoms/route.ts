import { NextRequest, NextResponse } from 'next/server';
import { ExpertSystemEngine } from '@/lib/expertSystem';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grouped = searchParams.get('grouped') === 'true';

    if (grouped) {
      const symptoms = await ExpertSystemEngine.getSymptomsByCategory();
      return NextResponse.json({ symptoms });
    } else {
      const symptoms = await ExpertSystemEngine.getAllSymptoms();
      return NextResponse.json({ symptoms });
    }
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch symptoms' },
      { status: 500 }
    );
  }
}