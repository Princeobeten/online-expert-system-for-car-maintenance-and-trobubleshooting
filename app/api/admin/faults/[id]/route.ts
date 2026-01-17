import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Fault from '@/models/Fault';
import { getUserFromToken, getTokenFromRequest } from '@/lib/auth';

// GET - Fetch single fault
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);
    
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const fault = await Fault.findOne({ fault_id: params.id });
    
    if (!fault) {
      return NextResponse.json({ error: 'Fault not found' }, { status: 404 });
    }
    
    return NextResponse.json({ fault });
  } catch (error) {
    console.error('Error fetching fault:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update fault
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    const fault = await Fault.findOneAndUpdate(
      { fault_id: params.id },
      { 
        fault_name: fault_name.trim(),
        severity,
        description: description?.trim(),
        category: category || 'Other'
      },
      { new: true }
    );
    
    if (!fault) {
      return NextResponse.json({ error: 'Fault not found' }, { status: 404 });
    }
    
    return NextResponse.json({ fault });
  } catch (error) {
    console.error('Error updating fault:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete fault
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);
    
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const fault = await Fault.findOneAndDelete({ fault_id: params.id });
    
    if (!fault) {
      return NextResponse.json({ error: 'Fault not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Fault deleted successfully' });
  } catch (error) {
    console.error('Error deleting fault:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}