import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Symptom from '@/models/Symptom';
import { getUserFromToken, getTokenFromRequest } from '@/lib/auth';

// GET - Fetch single symptom
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
    const symptom = await Symptom.findOne({ symptom_id: params.id });
    
    if (!symptom) {
      return NextResponse.json({ error: 'Symptom not found' }, { status: 404 });
    }
    
    return NextResponse.json({ symptom });
  } catch (error) {
    console.error('Error fetching symptom:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update symptom
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    const symptom = await Symptom.findOneAndUpdate(
      { symptom_id: params.id },
      { 
        description: description.trim(),
        category: category || 'Other'
      },
      { new: true }
    );
    
    if (!symptom) {
      return NextResponse.json({ error: 'Symptom not found' }, { status: 404 });
    }
    
    return NextResponse.json({ symptom });
  } catch (error) {
    console.error('Error updating symptom:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete symptom
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    const symptom = await Symptom.findOneAndDelete({ symptom_id: params.id });
    
    if (!symptom) {
      return NextResponse.json({ error: 'Symptom not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Symptom deleted successfully' });
  } catch (error) {
    console.error('Error deleting symptom:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}