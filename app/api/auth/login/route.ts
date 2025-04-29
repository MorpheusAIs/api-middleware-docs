import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

// Add OPTIONS method handler for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call backend login endpoint
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    console.log('Attempting login with backend URL:', backendUrl);
    
    const requestBody = {
      email: email,
      password: password,
    };

    console.log('Login request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${backendUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Backend response status:', response.status);
    
    const responseData = await response.json();
    console.log('Backend response data:', responseData);

    if (!response.ok) {
      console.error('Login failed:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      
      return NextResponse.json(
        { 
          message: responseData.detail || responseData.message || 'Login failed',
          error: responseData 
        },
        { status: response.status }
      );
    }

    // Generate CSRF token
    const csrfToken = randomBytes(32).toString('hex');
    
    // Create response with tokens in httpOnly cookies
    const nextResponse = NextResponse.json(
      { 
        message: 'Login successful',
        data: { csrf_token: csrfToken } // Return CSRF token in response body
      },
      { status: 200 }
    );

    // Set httpOnly cookies for tokens
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

    // Set CSRF token in a non-httpOnly cookie (needed for client-side requests)
    nextResponse.cookies.set('csrf_token', csrfToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 