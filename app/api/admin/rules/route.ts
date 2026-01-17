import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Rule from '@/models/Rule';
import Fault from '@/models/Fault';
import Symptom from '@/models/Symptom';
import { getUserFromToken, getTokenFromRequest } from '@/lib/auth';

// GET - Fetch all rules
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
    const rules = await Rule.find({}).sort({ createdAt: -1 });
    
    // Populate fault and symptom information
    const populatedRules = await Promise.all(
      rules.map(async (rule) => {
        const fault = await Fault.findOne({ fault_id: rule.fault_id });
        const symptoms = await Promise.all(
          rule.symptoms.map(async (symptomId: string) => {
            const symptom = await Symptom.findOne({ symptom_id: symptomId });
            return symptom ? { symptom_id: symptom.symptom_id, description: symptom.description } : null;
          })
        );
        
        return {
          ...rule.toObject(),
          fault: fault ? { fault_name: fault.fault_name, severity: fault.severity } : null,
          symptom_details: symptoms.filter(s => s !== null)
        };
      })
    );
    
    return NextResponse.json({ rules: populatedRules });
  } catch (error) {
    console.error('Error fetching rules:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new rule
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

    const { fault_id, symptoms, condition, confidence_level } = await request.json();
    
    if (!fault_id || !symptoms || !Array.isArray(symptoms) || symptoms.length === 0 || !condition) {
      return NextResponse.json({ error: 'Fault ID, symptoms array, and condition are required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Verify fault exists
    const fault = await Fault.findOne({ fault_id });
    if (!fault) {
      return NextResponse.json({ error: 'Fault not found' }, { status: 404 });
    }
    
    // Verify all symptoms exist
    const symptomChecks = await Promise.all(
      symptoms.map((symptomId: string) => Symptom.findOne({ symptom_id: symptomId }))
    );
    
    if (symptomChecks.some(symptom => !symptom)) {
      return NextResponse.json({ error: 'One or more symptoms not found' }, { status: 404 });
    }
    
    const rule = new Rule({
      fault_id,
      symptoms,
      condition: condition.trim(),
      confidence_level: confidence_level || 80
    });
    
    await rule.save();
    
    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error('Error creating rule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}