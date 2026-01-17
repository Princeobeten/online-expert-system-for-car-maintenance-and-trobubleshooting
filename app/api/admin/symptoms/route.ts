import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Symptom from '@/models/Symptom';
import { getUserFromToken, getTokenFromRequest } from '@/lib/auth';

// GET - Fetch all symptoms
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = getUserFromToken(token);
    
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const symptoms = await Symptom.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ symptoms });
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new symptom
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = getUserFromToken(token);
    
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { description, category } = await request.json();
    
    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const symptom = new Symptom({
      description: description.trim(),
      category: category || 'Other'
    });
    
    await symptom.save();
    
    return NextResponse.json({ symptom }, { status: 201 });
  } catch (error) {
    console.error('Error creating symptom:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}