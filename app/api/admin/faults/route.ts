import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Fault from '@/models/Fault';
import { getUserFromToken, getTokenFromRequest } from '@/lib/auth';

// GET - Fetch all faults
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);
    
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const faults = await Fault.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ faults });
  } catch (error) {
    console.error('Error fetching faults:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new fault
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);
    
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fault_name, severity, description, category } = await request.json();
    
    if (!fault_name || !severity) {
      return NextResponse.json({ error: 'Fault name and severity are required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const fault = new Fault({
      fault_name: fault_name.trim(),
      severity,
      description: description?.trim(),
      category: category || 'Other'
    });
    
    await fault.save();
    
    return NextResponse.json({ fault }, { status: 201 });
  } catch (error) {
    console.error('Error creating fault:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}