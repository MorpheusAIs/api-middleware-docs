import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from httpOnly cookie
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token found' },
        { status: 401 }
      );
    }

    // Call backend refresh endpoint
    const backendUrl = process.env.BACKEND_API_URL || 'https://api.mor.org';
    
    const response = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          message: responseData.detail || responseData.message || 'Token refresh failed',
          error: responseData 
        },
        { status: response.status }
      );
    }

    // Generate new CSRF token
    const csrfToken = randomBytes(32).toString('hex');
    
    // Create response with new tokens in httpOnly cookies
    const nextResponse = NextResponse.json(
      { 
        message: 'Token refresh successful',
        data: { csrf_token: csrfToken }
      },
      { status: 200 }
    );

    // Set new httpOnly cookies for tokens
    nextResponse.cookies.set('access_token', responseData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    nextResponse.cookies.set('refresh_token', responseData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Set new CSRF token
    nextResponse.cookies.set('csrf_token', csrfToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return nextResponse;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 