import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';
import { ExpertSystemEngine } from '@/lib/expertSystem';
import { connectToDatabase } from '@/lib/mongodb';
import Consultation from '@/models/Consultation';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const { symptoms, vehicleId } = await request.json();

    console.log('Diagnosis request received:');
    console.log('- Symptoms:', symptoms);
    console.log('- Vehicle ID:', vehicleId);

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Symptoms are required' },
        { status: 400 }
      );
    }

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    // Perform diagnosis using expert system
    const diagnoses = await ExpertSystemEngine.diagnose(symptoms);

    // Create consultation record
    const consultation = new Consultation({
      user_id: user.userId,
      vehicle_id: vehicleId,
      symptoms,
      status: 'Completed',
      fault_id: diagnoses.length > 0 ? diagnoses[0].fault.fault_id : undefined,
      diagnosis_confidence: diagnoses.length > 0 ? diagnoses[0].confidence : 0
    });

    await consultation.save();

    return NextResponse.json({
      consultationId: consultation.consultation_id,
      diagnoses,
      message: diagnoses.length > 0 
        ? 'Diagnosis completed successfully' 
        : 'No matching faults found for the selected symptoms'
    });

  } catch (error) {
    console.error('Diagnosis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}