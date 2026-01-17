import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const getTokenFromRequest = (request: NextRequest): string | null => {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    console.log('Token found in Authorization header');
    return authHeader.substring(7);
  }
  
  // Check cookies
  const token = request.cookies.get('token')?.value;
  if (token) {
    console.log('Token found in cookies');
    return token;
  }
  
  console.log('No token found in request');
  return null;
};

export const getUserFromToken = (token: string) => {
  const decoded = verifyToken(token);
  if (decoded && typeof decoded === 'object') {
    return decoded as { userId: string; email: string; role: string };
  }
  return null;
};