import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromRequest, getUserFromToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('Middleware running for:', pathname);

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/'];
  
  if (publicRoutes.includes(pathname)) {
    console.log('Public route, allowing access');
    return NextResponse.next();
  }

  // Check for authentication on protected routes
  console.log('Checking authentication for protected route');
  const token = getTokenFromRequest(request);
  console.log('Token found in middleware:', !!token);
  
  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const user = getUserFromToken(token);
  console.log('User decoded in middleware:', !!user, user?.email);
  
  if (!user) {
    console.log('Invalid token, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin-only routes
  if (pathname.startsWith('/admin') && user.role !== 'Admin') {
    console.log('Non-admin trying to access admin route, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('Authentication successful, allowing access');
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Temporarily disable middleware to test authentication
    // '/dashboard/:path*',
    // '/vehicles/:path*',
    // '/consultation/:path*',
    // '/admin/:path*',
    // '/profile/:path*'
  ]
};