import { NextRequest, NextResponse } from 'next/server';

// NOTE: This registration proxy is simple and does NOT require authentication
// like the /keys route does. It just forwards the request.

const API_BACKEND_URL = process.env.API_BACKEND_URL || 'http://127.0.0.1:8000';

async function proxyRegisterRequest(req: NextRequest) {
  // Registration endpoint doesn't require a user token
  const url = `${API_BACKEND_URL}/api/v1/auth/register`;
  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('cookie'); // Don't forward browser cookies

  try {
    const backendResponse = await fetch(url, {
      method: req.method, // Should be POST
      headers: headers,
      body: req.body,
      // duplex: 'half', // Only if streaming needed
    });

    // Forward the response (including potential 422 errors)
    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers,
    });

  } catch (error) {
    console.error('API Register Proxy Error:', error);
    return NextResponse.json({ message: 'Error proxying registration request to backend' }, { status: 502 });
  }
}

// Only handle POST for registration
export async function POST(req: NextRequest) {
  // Check if the request method is POST, though Next.js routing handles this
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }
  return proxyRegisterRequest(req);
}

// Add OPTIONS method handler
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
} 