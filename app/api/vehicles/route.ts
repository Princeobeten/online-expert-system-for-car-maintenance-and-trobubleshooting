import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

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

    await dbConnect();

    const vehicles = await Vehicle.find({ user_id: user.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const { brand, model, year, engine_type } = await request.json();

    if (!brand || !model || !year) {
      return NextResponse.json(
        { error: 'Brand, model, and year are required' },
        { status: 400 }
      );
    }

    const vehicle = new Vehicle({
      user_id: user.userId,
      brand,
      vehicleModel: model,
      year,
      engine_type
    });

    await vehicle.save();

    return NextResponse.json(
      {
        message: 'Vehicle added successfully',
        vehicle
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}