import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    console.log('Auth check - checking for token...');
    const token = getTokenFromRequest(request);
    console.log('Token found:', !!token);
    
    if (!token) {
      console.log('No token found in request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = getUserFromToken(token);
    console.log('Token decoded:', !!decoded);
    
    if (!decoded) {
      console.log('Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ user_id: decoded.userId }).select('-password');
    if (!user) {
      console.log('User not found for userId:', decoded.userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Auth successful for user:', user.email);
    return NextResponse.json({
      user: {
        id: user.user_id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}