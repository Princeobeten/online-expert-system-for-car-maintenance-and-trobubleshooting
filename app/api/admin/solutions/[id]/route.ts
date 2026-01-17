import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Solution from '@/models/Solution';
import Fault from '@/models/Fault';
import { getUserFromToken, getTokenFromRequest } from '@/lib/auth';

// GET - Fetch single solution
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
    const solution = await Solution.findOne({ solution_id: params.id });
    
    if (!solution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }
    
    // Populate fault information
    const fault = await Fault.findOne({ fault_id: solution.fault_id });
    const populatedSolution = {
      ...solution.toObject(),
      fault: fault ? { fault_name: fault.fault_name, severity: fault.severity } : null
    };
    
    return NextResponse.json({ solution: populatedSolution });
  } catch (error) {
    console.error('Error fetching solution:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update solution
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

    const { fault_id, repair_action, estimated_cost, difficulty_level, estimated_time, tools_required } = await request.json();
    
    if (!fault_id || !repair_action) {
      return NextResponse.json({ error: 'Fault ID and repair action are required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Verify fault exists
    const fault = await Fault.findOne({ fault_id });
    if (!fault) {
      return NextResponse.json({ error: 'Fault not found' }, { status: 404 });
    }
    
    const solution = await Solution.findOneAndUpdate(
      { solution_id: params.id },
      { 
        fault_id,
        repair_action: repair_action.trim(),
        estimated_cost: estimated_cost || undefined,
        difficulty_level: difficulty_level || 'Medium',
        estimated_time: estimated_time?.trim(),
        tools_required: tools_required || []
      },
      { new: true }
    );
    
    if (!solution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }
    
    return NextResponse.json({ solution });
  } catch (error) {
    console.error('Error updating solution:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete solution
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
    
    const solution = await Solution.findOneAndDelete({ solution_id: params.id });
    
    if (!solution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Solution deleted successfully' });
  } catch (error) {
    console.error('Error deleting solution:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}