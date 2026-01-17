import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Solution from '@/models/Solution';
import Fault from '@/models/Fault';
import { getUserFromToken, getTokenFromRequest } from '@/lib/auth';

// GET - Fetch all solutions
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
    const solutions = await Solution.find({}).sort({ createdAt: -1 });
    
    // Populate fault information
    const populatedSolutions = await Promise.all(
      solutions.map(async (solution) => {
        const fault = await Fault.findOne({ fault_id: solution.fault_id });
        return {
          ...solution.toObject(),
          fault: fault ? { fault_name: fault.fault_name, severity: fault.severity } : null
        };
      })
    );
    
    return NextResponse.json({ solutions: populatedSolutions });
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new solution
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
    
    const solution = new Solution({
      fault_id,
      repair_action: repair_action.trim(),
      estimated_cost: estimated_cost || undefined,
      difficulty_level: difficulty_level || 'Medium',
      estimated_time: estimated_time?.trim(),
      tools_required: tools_required || []
    });
    
    await solution.save();
    
    return NextResponse.json({ solution }, { status: 201 });
  } catch (error) {
    console.error('Error creating solution:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}