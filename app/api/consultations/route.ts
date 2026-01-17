import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Consultation from '@/models/Consultation';
import Vehicle from '@/models/Vehicle';
import Fault from '@/models/Fault';
import Symptom from '@/models/Symptom';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    // Get consultations with populated data
    const consultations = await Consultation.find({ user_id: user.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    // Populate related data
    const populatedConsultations = await Promise.all(
      consultations.map(async (consultation) => {
        const vehicle = await Vehicle.findOne({ vehicle_id: consultation.vehicle_id });
        const fault = consultation.fault_id 
          ? await Fault.findOne({ fault_id: consultation.fault_id })
          : null;
        
        const symptoms = await Promise.all(
          consultation.symptoms.map(async (symptomId: string) => {
            return await Symptom.findOne({ symptom_id: symptomId });
          })
        );

        return {
          ...consultation.toObject(),
          vehicle,
          fault,
          symptoms: symptoms.filter(Boolean)
        };
      })
    );

    return NextResponse.json({ consultations: populatedConsultations });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}